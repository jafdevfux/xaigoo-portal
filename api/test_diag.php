<?php
// Diagnóstico detalhado — apagar depois!
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: text/plain; charset=utf-8');

echo "=== TESTE 1: config.php ===\n";
try {
    require_once __DIR__ . '/config.php';
    echo "OK - APP_ENV: " . (defined('APP_ENV') ? APP_ENV : 'undefined') . "\n";
    echo "OK - DB_HOST: " . (defined('DB_HOST') ? DB_HOST : 'undefined') . "\n";
    echo "OK - DB_NAME: " . (defined('DB_NAME') ? DB_NAME : 'undefined') . "\n";
    echo "OK - CORS_ALLOWED_ORIGINS: " . (defined('CORS_ALLOWED_ORIGINS') ? CORS_ALLOWED_ORIGINS : 'undefined') . "\n";
} catch (Throwable $e) {
    echo "ERRO: " . $e->getMessage() . "\n";
}

echo "\n=== TESTE 2: helpers.php ===\n";
try {
    require_once __DIR__ . '/helpers.php';
    echo "OK - helpers carregado\n";
} catch (Throwable $e) {
    echo "ERRO: " . $e->getMessage() . "\n";
}

echo "\n=== TESTE 3: db.php ===\n";
try {
    require_once __DIR__ . '/db.php';
    echo "OK - db.php carregado\n";
} catch (Throwable $e) {
    echo "ERRO: " . $e->getMessage() . "\n";
}

echo "\n=== TESTE 4: conexão DB ===\n";
try {
    $pdo = getPDO();
    echo "OK - conectou ao banco!\n";
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
    $row = $stmt->fetch();
    echo "OK - tabela users tem " . $row['total'] . " registro(s)\n";
} catch (Throwable $e) {
    echo "ERRO: " . $e->getMessage() . "\n";
}

echo "\n=== TESTE 5: auth.php ===\n";
try {
    require_once __DIR__ . '/auth.php';
    echo "OK - auth.php carregado\n";
} catch (Throwable $e) {
    echo "ERRO: " . $e->getMessage() . "\n";
}

echo "\n=== TESTE 6: enableCors() ===\n";
try {
    enableCors();
    echo "OK - CORS habilitado\n";
} catch (Throwable $e) {
    echo "ERRO: " . $e->getMessage() . "\n";
}

echo "\n=== TUDO OK ===\n";
