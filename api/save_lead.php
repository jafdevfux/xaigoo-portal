<?php

// SPDX-License-Identifier: MIT
// Xaigoo Pipeline — Endpoint para salvar leads extraídos da extensão Instagram
// POST /api/save_lead.php
// Body: {username: string, profile_url: string, ai_enabled: bool}
// Requer autenticação via sessão @xaigoo.app (xaigoo_session)

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/auth.php';

// CORS + preflight
enableCors();

// Garante Content-Type JSON
header('Content-Type: application/json; charset=utf-8');

// Exige autenticação (sessão xaigoo_session)
ensureSessionStarted();
$userId = $_SESSION['user_id'] ?? null;
if (empty($userId)) {
    errorResponse('Não autenticado. Faça login em portal.xaigoo.app.', 401);
}

// session_id efetivo da sessão PHP (usado para rastrear leads capturados pela extensão)
$sessionId = session_id();

// ----------------------------------------------------------
// GET /api/save_lead.php?stats=1  → estatísticas de leads
// GET /api/save_lead.php?stats=1&session_id=xxx → stats apenas daquela sessão
// ----------------------------------------------------------
if (strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    if ((isset($_GET['stats']) && $_GET['stats'] === '1')) {
        try {
            $pdo = getPDO();
            $sessFilter = '';
            $sessParams = [];
            $sessId = trim((string) ($_GET['session_id'] ?? ''));
            if ($sessId !== '' && preg_match('/^[a-zA-Z0-9,-]{22,128}$/', $sessId)) {
                $sessFilter = ' AND created_by = :sessId';
                $sessParams[':sessId'] = $sessId;
            }

            $sqlTotal = "SELECT COUNT(*) as total FROM influencers WHERE platform = 'Instagram'$sessFilter";
            $stmtTotal = $pdo->prepare($sqlTotal);
            $stmtTotal->execute($sessParams);
            $total = (int) $stmtTotal->fetch()['total'];

            $sqlL1 = "SELECT COUNT(*) as total FROM influencers WHERE platform = 'Instagram' AND segmentation_level = 1$sessFilter";
            $stmtL1 = $pdo->prepare($sqlL1);
            $stmtL1->execute($sessParams);
            $lvl1 = (int) $stmtL1->fetch()['total'];

            $sqlL2 = "SELECT COUNT(*) as total FROM influencers WHERE platform = 'Instagram' AND segmentation_level = 2$sessFilter";
            $stmtL2 = $pdo->prepare($sqlL2);
            $stmtL2->execute($sessParams);
            $lvl2 = (int) $stmtL2->fetch()['total'];

            $sqlNull = "SELECT COUNT(*) as total FROM influencers WHERE platform = 'Instagram' AND segmentation_level IS NULL$sessFilter";
            $stmtNull = $pdo->prepare($sqlNull);
            $stmtNull->execute($sessParams);
            $lvlNull = (int) $stmtNull->fetch()['total'];

            jsonResponse([
                'success' => true,
                'total' => $total,
                'level_1' => $lvl1,
                'level_2' => $lvl2,
                'level_null' => $lvlNull,
                'session_id' => $sessId !== '' ? $sessId : null,
            ]);
        } catch (PDOException $e) {
            errorResponse('Erro ao buscar estatísticas.', 500);
        }
    }
    errorResponse('Parâmetro stats=1 obrigatório.', 400);
}

// Exige método POST (para salvar lead)
requireMethod('POST');

// Lê input JSON
$input = getJsonInput();

$username = trim((string) ($input['username'] ?? ''));
$profileUrl = trim((string) ($input['profile_url'] ?? ''));
$aiEnabled = isset($input['ai_enabled']) ? (bool) $input['ai_enabled'] : false;
$hasMessageButton = isset($input['has_message_button']) ? ($input['has_message_button'] === null ? null : (bool) $input['has_message_button']) : null;

// Validações básicas
if ($username === '') {
    errorResponse('Campo username é obrigatório.', 422);
}
if ($profileUrl === '') {
    errorResponse('Campo profile_url é obrigatório.', 422);
}
if (!filter_var($profileUrl, FILTER_VALIDATE_URL)) {
    errorResponse('profile_url deve ser uma URL válida.', 422);
}

// Normaliza username: remove @ inicial se presente
if (str_starts_with($username, '@')) {
    $username = substr($username, 1);
}

// Classificação via DeepSeek (se IA habilitada)
$segmentationLevel = null;
$aiUsed = false;

if ($aiEnabled) {
    $segmentationLevel = classifyWithDeepSeek($username);
    $aiUsed = true;
    // Se classificação falhar (retorna null), segmentationLevel permanece null
}

// Inserção no banco
try {
    $pdo = getPDO();
    $pdo->beginTransaction();

    // Verifica se já existe (pelo UNIQUE em name_or_handle)
    $check = $pdo->prepare('SELECT id, segmentation_level, created_by FROM influencers WHERE name_or_handle = :username LIMIT 1');
    $check->execute([':username' => $username]);
    $existing = $check->fetch();

    if ($existing) {
        // Já existe - retorna sucesso com flag duplicate
        $pdo->commit();
        jsonResponse([
            'success' => true,
            'id' => $existing['id'],
            'duplicate' => true,
            'segmentation_level' => $existing['segmentation_level'] ?? null,
            'created_by' => $existing['created_by'] ?? null,
            'ai_used' => $aiUsed
        ]);
    }

    // Insere novo lead
    $now = date('Y-m-d H:i:s');
    $fields = [
        'id' => 'inf-' . uniqid(),
        'name_or_handle' => $username,
        'platform' => 'Instagram',
        'link' => $profileUrl,
        'audience_type' => '',
        'justification' => '',
        'first_contact_date' => null,
        'status' => 'A pesquisar',
        'response_received' => 'Pendente',
        'proposal_sent' => 0,
        'videos_sent' => 0,
        'next_action' => '',
        'notes' => '',
        'tipo' => 'Motorista',
        'segmentation_level' => $segmentationLevel,
        'has_message_button' => $hasMessageButton === null ? null : ($hasMessageButton ? 1 : 0),
        'last_visibility_check' => $hasMessageButton !== null ? $now : null,
        'created_by' => $sessionId,
        'created_at' => $now,
        'updated_at' => $now,
    ];

    $cols = implode(', ', array_keys($fields));
    $placeholders = ':' . implode(', :', array_keys($fields));
    $stmt = $pdo->prepare("INSERT IGNORE INTO influencers ({$cols}) VALUES ({$placeholders})");
    $stmt->execute($fields);

    if ($stmt->rowCount() === 0) {
        // Race condition: outro processo inseriu entre o check e o insert
        // Busca o existente e retorna
        $pdo->commit();
        $sel = $pdo->prepare('SELECT id, segmentation_level FROM influencers WHERE name_or_handle = :username LIMIT 1');
        $sel->execute([':username' => $username]);
        $existing = $sel->fetch();
        jsonResponse([
            'success' => true,
            'id' => $existing['id'] ?? '',
            'duplicate' => true,
            'segmentation_level' => $existing['segmentation_level'] ?? null,
            'ai_used' => $aiUsed
        ]);
    }

    $pdo->commit();

    jsonResponse([
        'success' => true,
        'id' => $fields['id'],
        'duplicate' => false,
        'segmentation_level' => $segmentationLevel,
        'ai_used' => $aiUsed
    ]);
} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    // Duplicate entry (UNIQUE violation) - embora INSERT IGNORE deva prevenir
    if ($e->getCode() === '23000') {
        // Tenta buscar o existente
        try {
            $pdo = getPDO();
            $sel = $pdo->prepare('SELECT id, segmentation_level FROM influencers WHERE name_or_handle = :username LIMIT 1');
            $sel->execute([':username' => $username]);
            $existing = $sel->fetch();
            if ($existing) {
                jsonResponse([
                    'success' => true,
                    'id' => $existing['id'],
                    'duplicate' => true,
                    'segmentation_level' => $existing['segmentation_level'] ?? null,
                    'ai_used' => $aiUsed
                ]);
            }
        } catch (PDOException) {
            // Ignora
        }
        errorResponse('Violação de constraint: username já existe.', 409);
    }
    errorResponse('Erro ao salvar lead.', 500);
}

/**
 * Classifica username via DeepSeek API
 *
 * @param string $username
 * @return int|null 1 (forte aderência), 2 (neutro/fora), null (falha)
 */
function classifyWithDeepSeek(string $username): ?int
{
    $apiKey = DEEPSEEK_API_KEY;
    if ($apiKey === '') {
        error_log('[save_lead] DEEPSEEK_API_KEY não configurada');
        return null;
    }

    $prompt = <<<PROMPT
Você é um classificador de leads B2B para o ecossistema Xaigoo (focado em motoristas de aplicativos como Uber/99/DiDi).

Classifique o perfil do Instagram com base APENAS no username/handle fornecido: "{$username}"

Critério:
- Nível 1 (Forte aderência): perfil claramente relacionado a motoristas de app, mobilidade urbana, corridas, transporte, dicas para motoristas, ganhos/km, vida de motorista, dashcam, frota, ou comunidade de motoristas. Pode ter termos como "motorista", "uber", "99", "corrida", "km", "app", "taxista/motorista", etc.
- Nível 2 (Neutro/Fora do nicho): genérico, lifestyle, moda, beleza, memes, pets, comida, viagem não ligada a motoristas, influencers gerais sem aderência ao nicho de motoristas de app.

Responda APENAS com "1" ou "2" (sem explicação, sem texto extra).
PROMPT;

    $payload = [
        'model' => DEEPSEEK_MODEL,
        'messages' => [
            ['role' => 'system', 'content' => 'Você é um classificador de leads B2B. Responda apenas com 1 ou 2.'],
            ['role' => 'user', 'content' => $prompt]
        ],
        'max_tokens' => 10,
        'temperature' => 0.1,
    ];

    $ch = curl_init('https://api.deepseek.com/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey,
        ],
        CURLOPT_TIMEOUT => DEEPSEEK_TIMEOUT,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError || $httpCode !== 200) {
        error_log("[save_lead] DeepSeek erro: HTTP {$httpCode}, curl: {$curlError}");
        return null;
    }

    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('[save_lead] DeepSeek resposta JSON inválida');
        return null;
    }

    $content = trim((string) ($data['choices'][0]['message']['content'] ?? ''));
    if ($content === '1' || $content === '2') {
        return (int) $content;
    }

    error_log("[save_lead] DeepSeek resposta inesperada: {$content}");
    return null;
}