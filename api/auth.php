<?php

// SPDX-License-Identifier: MIT
// Xaigoo Pipeline — Auth handlers (sessão PHP nativa, domínio restrito @xaigoo.app)
// Endpoints: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout
// Dependências: config.php (AUTH_SESSION_NAME), helpers.php (jsonResponse, errorResponse, getJsonInput,
//   isXaigooEmail, ensureSessionStarted, xaigooDomainErrorMessage), db.php (getPDO)
// Este arquivo é incluído por index.php; não processa rota sozinho.

declare(strict_types=1);

// ---------------------------------------------------------------------------
// Helpers internos de auth (não expostos globalmente além deste arquivo)
// ---------------------------------------------------------------------------

/**
 * Normaliza e-mail: trim + lowercase.
 */
function authNormalizeEmail(string $email): string
{
    return strtolower(trim($email));
}

/**
 * Converte linha do banco `users` para resposta pública (sem hash, camelCase).
 *
 * @param array<string,mixed> $row
 * @return array<string,mixed>
 */
function authPublicUser(array $row): array
{
    return [
        'id'        => $row['id'],
        'name'      => $row['name'],
        'email'     => $row['email'],
        'createdAt' => $row['created_at'] ?? null,
        'updatedAt' => $row['updated_at'] ?? null,
    ];
}

/**
 * Valida força da senha: min 8 chars, pelo menos 1 letra e 1 número.
 * Retorna mensagem de erro PT-BR ou null se válida.
 */
function authValidatePassword(string $password): ?string
{
    if (mb_strlen($password) < 8) {
        return 'Senha deve ter pelo menos 8 caracteres.';
    }
    if (!preg_match('/[A-Za-z]/', $password) || !preg_match('/[0-9]/', $password)) {
        return 'Senha deve conter pelo menos 1 letra e 1 número.';
    }
    return null;
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

/**
 * POST /api/auth/register
 * Body: {name, email, password}
 * Valida domínio @xaigoo.app (422), e-mail formato, senha forte, duplica (409).
 * Cria id 'usr-' + uniqid(), hash, insert, inicia sessão, retorna user 201 sem hash.
 */
function handleAuthRegister(): void
{
    requireMethod('POST');
    $input = getJsonInput();

    $name     = trim((string) ($input['name'] ?? ''));
    $emailRaw = (string) ($input['email'] ?? '');
    $email    = authNormalizeEmail($emailRaw);
    $password = (string) ($input['password'] ?? '');

    // Validações de presença / formato
    if ($name === '' || mb_strlen($name) < 2) {
        errorResponse('Nome deve ter pelo menos 2 caracteres.', 422);
    }
    if ($email === '') {
        errorResponse('E-mail é obrigatório.', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        errorResponse('E-mail inválido.', 422);
    }
    // Domínio restrito — sempre após filter_var para mensagem precisa vir primeiro se formato inválido
    if (!isXaigooEmail($email)) {
        errorResponse(xaigooDomainErrorMessage(), 422);
    }
    if ($password === '') {
        errorResponse('Senha é obrigatória.', 422);
    }
    $pwdError = authValidatePassword($password);
    if ($pwdError !== null) {
        errorResponse($pwdError, 422);
    }

    $id   = 'usr-' . uniqid();
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $now  = date('Y-m-d H:i:s');

    try {
        $pdo = getPDO();
        $stmt = $pdo->prepare(
            'INSERT INTO users (id, name, email, password_hash, created_at, updated_at) ' .
            'VALUES (:id, :name, :email, :hash, :created_at, :updated_at)'
        );
        $stmt->execute([
            ':id'         => $id,
            ':name'       => $name,
            ':email'      => $email,
            ':hash'       => $hash,
            ':created_at' => $now,
            ':updated_at' => $now,
        ]);
    } catch (PDOException $e) {
        // Duplicate entry (UNIQUE email) -> 409
        if ($e->getCode() === '23000') {
            errorResponse('E-mail já cadastrado.', 409);
        }
        errorResponse('Erro ao criar usuário.', 500);
    }

    // Inicia sessão e fixa usuário
    ensureSessionStarted();
    // Regenera ID para prevenir fixation no registro também
    session_regenerate_id(true);
    $_SESSION['user_id'] = $id;

    // Busca linha recém criada para resposta consistente (sem hash)
    try {
        $pdo = getPDO();
        $sel = $pdo->prepare('SELECT id, name, email, created_at, updated_at FROM users WHERE id = :id');
        $sel->execute([':id' => $id]);
        $row = $sel->fetch();
        if (!$row) {
            // Fallback se SELECT falhar (não deve ocorrer)
            jsonResponse(['id' => $id, 'name' => $name, 'email' => $email, 'createdAt' => $now], 201);
        }
        jsonResponse(authPublicUser($row), 201);
    } catch (PDOException $e) {
        jsonResponse(['id' => $id, 'name' => $name, 'email' => $email, 'createdAt' => $now], 201);
    }
}

/**
 * POST /api/auth/login
 * Body: {email, password}
 * Valida domínio antes de qualquer lookup (403 se fora de @xaigoo.app).
 * Verifica hash; em sucesso regenera ID e grava $_SESSION[user_id].
 */
function handleAuthLogin(): void
{
    requireMethod('POST');
    $input = getJsonInput();

    $emailRaw = (string) ($input['email'] ?? '');
    $email    = authNormalizeEmail($emailRaw);
    $password = (string) ($input['password'] ?? '');

    if ($email === '' || $password === '') {
        errorResponse('E-mail e senha são obrigatórios.', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        errorResponse('E-mail inválido.', 422);
    }
    // Bloqueio por domínio deve ocorrer mesmo se usuário existir — 403
    if (!isXaigooEmail($email)) {
        errorResponse(xaigooDomainErrorMessage(), 403);
    }

    try {
        $pdo = getPDO();
        $stmt = $pdo->prepare('SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE email = :email LIMIT 1');
        $stmt->execute([':email' => $email]);
        $row = $stmt->fetch();
    } catch (PDOException $e) {
        errorResponse('Erro ao autenticar.', 500);
    }

    if (!$row || !password_verify($password, (string) $row['password_hash'])) {
        errorResponse('Credenciais inválidas.', 401);
    }

    // Rehash se necessário (cost alterado)
    if (password_needs_rehash((string) $row['password_hash'], PASSWORD_DEFAULT)) {
        try {
            $newHash = password_hash($password, PASSWORD_DEFAULT);
            $pdo = getPDO();
            $upd = $pdo->prepare('UPDATE users SET password_hash = :hash, updated_at = :now WHERE id = :id');
            $upd->execute([':hash' => $newHash, ':now' => date('Y-m-d H:i:s'), ':id' => $row['id']]);
        } catch (PDOException $e) {
            // Não bloqueia login se rehash falhar
        }
    }

    ensureSessionStarted();
    session_regenerate_id(true);
    $_SESSION['user_id'] = $row['id'];

    jsonResponse(authPublicUser($row), 200);
}

/**
 * GET /api/auth/me
 * Retorna usuário da sessão ou 401.
 */
function handleAuthMe(): void
{
    requireMethod('GET');
    ensureSessionStarted();

    $userId = $_SESSION['user_id'] ?? null;
    if (empty($userId)) {
        errorResponse('Não autenticado.', 401);
    }

    try {
        $pdo = getPDO();
        $stmt = $pdo->prepare('SELECT id, name, email, created_at, updated_at FROM users WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $userId]);
        $row = $stmt->fetch();
    } catch (PDOException $e) {
        errorResponse('Erro ao buscar usuário.', 500);
    }

    if (!$row) {
        // Sessão órfã — limpa
        $_SESSION = [];
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy();
        }
        errorResponse('Não autenticado.', 401);
    }

    // Heartbeat: atualiza updated_at para marcar como online (TTL 60s)
    try {
        $pdo = getPDO();
        $upd = $pdo->prepare('UPDATE users SET updated_at = :now WHERE id = :id');
        $upd->execute([':now' => date('Y-m-d H:i:s'), ':id' => $userId]);
    } catch (PDOException) {
        // Não bloqueia a resposta do me() se o UPDATE falhar
    }

    jsonResponse(authPublicUser($row), 200);
}

/**
 * GET /api/auth/online
 * Lista usuários com updated_at nos últimos 60 segundos (online).
 * O heartbeat do frontend chama /api/auth/me a cada 30s, que atualiza updated_at.
 */
function handleAuthOnline(): void
{
    requireMethod('GET');
    ensureSessionStarted();

    $cutoff = time() - 60;

    try {
        $pdo = getPDO();
        $stmt = $pdo->prepare(
            'SELECT id, name, email FROM users WHERE updated_at >= :cutoff ORDER BY updated_at DESC'
        );
        $stmt->execute([':cutoff' => date('Y-m-d H:i:s', $cutoff)]);
        $rows = $stmt->fetchAll();
    } catch (PDOException $e) {
        errorResponse('Erro ao buscar usuários online.', 500);
    }

    $list = [];
    foreach ($rows as $r) {
        $list[] = ['id' => $r['id'], 'name' => $r['name'], 'email' => $r['email']];
    }

    jsonResponse(['online' => $list, 'count' => count($list)], 200);
}

/**
 * POST /api/auth/logout
 * Destrói sessão e retorna {ok:true}. Sempre 200 mesmo sem sessão prévia.
 */
function handleAuthLogout(): void
{
    requireMethod('POST');
    ensureSessionStarted();

    // Limpa dados
    $_SESSION = [];

    // Remove cookie de sessão
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        // Usa valores efetivos do cookie corrente quando possível
        setcookie(
            session_name(),
            '',
            [
                'expires'  => time() - 42000,
                'path'     => $params['path'] ?? '/',
                'domain'   => $params['domain'] ?? '',
                'secure'   => (bool) ($params['secure'] ?? false),
                'httponly' => (bool) ($params['httponly'] ?? true),
                'samesite' => $params['samesite'] ?? 'Lax',
            ]
        );
    }

    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }

    jsonResponse(['ok' => true], 200);
}
