<?php

// SPDX-License-Identifier: MIT
// Xaigoo Pipeline — API helpers

declare(strict_types=1);

/**
 * Envia resposta JSON e encerra execução.
 *
 * @param mixed $data Payload a serializar
 * @param int   $code HTTP status code
 */
function jsonResponse(mixed $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Atalho para resposta de erro em JSON.
 *
 * @param string $msg  Mensagem de erro
 * @param int    $code HTTP status code
 */
function errorResponse(string $msg, int $code = 400): void
{
    jsonResponse(['error' => $msg], $code);
}

/**
 * Lê e decodifica JSON do body da requisição.
 *
 * @return array<string,mixed>
 */
function getJsonInput(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        errorResponse('Invalid JSON body: ' . json_last_error_msg(), 400);
    }

    return is_array($decoded) ? $decoded : [];
}

/**
 * Configura cabeçalhos CORS a partir de CORS_ALLOWED_ORIGINS (config.php).
 * Quando a origem é permitida envia Allow-Credentials e Allow-Headers com Cookie.
 * Nunca envia '*' quando credentials estão habilitados (sempre reflete a origem).
 * Responde OPTIONS com 204 quando necessário.
 */
function enableCors(): void
{
    $allowedRaw = defined('CORS_ALLOWED_ORIGINS') ? CORS_ALLOWED_ORIGINS : '*';
    $allowedList = array_map('trim', explode(',', $allowedRaw));
    $hasWildcard = in_array('*', $allowedList, true);
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($hasWildcard) {
        // Wildcard com credentials: nunca enviar '*', refletir a origem solicitada
        if ($origin !== '') {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
            header('Access-Control-Allow-Credentials: true');
        }
    } else {
        if ($origin !== '' && in_array($origin, $allowedList, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
            header('Access-Control-Allow-Credentials: true');
        } elseif ($origin !== '') {
            // Origem não permitida — ainda envia Vary para cache correto
            header('Vary: Origin');
        }
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Cookie, Accept, Origin, X-Xaigoo-Session');
    header('Access-Control-Expose-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/**
 * Valida método HTTP; se não bater, retorna 405.
 *
 * @param string|string[] $methods Método(s) permitido(s)
 */
function requireMethod(string|array $methods): void
{
    $allowed = is_array($methods) ? $methods : [$methods];
    $current = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

    if (!in_array($current, array_map('strtoupper', $allowed), true)) {
        header('Allow: ' . implode(', ', $allowed));
        errorResponse('Method Not Allowed', 405);
    }
}

/**
 * Extrai segmentos do path da URL, removendo query string e prefixo base /api.
 * Ex: /api/influencers/inf-1?foo=bar => ['influencers', 'inf-1']
 *
 * @return string[]
 */
function getPathSegments(): array
{
    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    // Remove query string
    $path = parse_url($uri, PHP_URL_PATH) ?: '/';
    // Normaliza barras duplicadas e trailing slash
    $path = rtrim($path, '/');
    if ($path === '') {
        $path = '/';
    }

    // Remove prefixo /api quando presente (HomeHost: /api/index.php, php -S: /api)
    // Suporta: /api, /api/, /api/health, /api/influencers/123
    // Também suporta quando o arquivo é acessado como /api/index.php/...
    $path = preg_replace('#^/api(?:/index\.php)?#', '', $path) ?: '/';

    $path = trim($path, '/');
    if ($path === '' || $path === '/') {
        return [];
    }

    return explode('/', $path);
}

// ---------------------------------------------------------------------------
// Helpers de conversão snake_case (MySQL) <-> camelCase (frontend React)
// ---------------------------------------------------------------------------

/**
 * Converte snake_case para camelCase.
 */
function snakeToCamel(string $snake): string
{
    return lcfirst(str_replace('_', '', ucwords($snake, '_')));
}

/**
 * Converte camelCase para snake_case.
 */
function camelToSnake(string $camel): string
{
    return strtolower((string) preg_replace('/[A-Z]/', '_$0', $camel));
}

/**
 * Converte chaves de um array associativo (linha do banco) de snake_case para camelCase.
 *
 * @param array<string,mixed> $row
 * @return array<string,mixed>
 */
function rowToCamel(array $row): array
{
    $out = [];
    foreach ($row as $k => $v) {
        // Booleans: proposal_sent / videos_sent são TINYINT(1) no banco
        if (in_array($k, ['proposal_sent', 'videos_sent'], true)) {
            $v = (bool) $v;
        }
        $out[snakeToCamel((string) $k)] = $v;
    }
    return $out;
}

// ---------------------------------------------------------------------------
// Auth — domínio restrito + sessão PHP
// ---------------------------------------------------------------------------

/**
 * Verifica se o e-mail pertence exatamente ao domínio @xaigoo.app (case-insensitive).
 * Não aceita subdomínios (ex: @mail.xaigoo.app é negado).
 *
 * Regex rígida: um ou mais chars que não sejam @ nem espaço, seguido de @xaigoo.app exato.
 */
function isXaigooEmail(string $email): bool
{
    $email = strtolower(trim($email));
    return (bool) preg_match('/^[^@\s]+@xaigoo\.app$/i', $email);
}

/**
 * Inicia a sessão PHP com nome e cookie seguros para auth.
 * Usa session_name('xaigoo_session'), httponly, SameSite Lax, lifetime 0.
 * Secure = true apenas em production (APP_ENV === 'production').
 * Idempotente: se sessão já ativa, não faz nada.
 *
 * EXTENSÃO CHROME (MV3): O background service worker NÃO consegue enviar
 * o header Cookie via fetch() (é forbidden header). Por isso aceita o
 * header customizado X-Xaigoo-Session como alternativa. Quando presente,
 * usa session_id() para restaurar a sessão correspondente.
 */
function ensureSessionStarted(): void
{
    if (session_status() !== PHP_SESSION_NONE) {
        return;
    }

    $sessionName = defined('AUTH_SESSION_NAME') ? AUTH_SESSION_NAME : 'xaigoo_session';
    session_name($sessionName);

    $isProduction = defined('APP_ENV') && APP_ENV === 'production';

    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'domain'   => '',
        'secure'   => $isProduction ? true : false,
        'httponly' => true,
        'samesite' => $isProduction ? 'None' : 'Lax',
    ]);

    // Extensão Chrome envia session ID via header customizado
    // (fetch() no service worker não pode enviar Cookie header)
    $extSessionId = $_SERVER['HTTP_X_XAIGOO_SESSION'] ?? '';
    if ($extSessionId !== '' && preg_match('/^[a-zA-Z0-9,-]{22,128}$/', $extSessionId)) {
        session_id($extSessionId);
    }

    session_start();
}

/**
 * Mensagem padrão quando e-mail fora do domínio permitido é rejeitado.
 */
function xaigooDomainErrorMessage(): string
{
    return 'Apenas contas @xaigoo.app são permitidas. Use seu e-mail corporativo Xaigoo.';
}
