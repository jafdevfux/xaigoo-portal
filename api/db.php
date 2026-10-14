<?php

// SPDX-License-Identifier: MIT
// Xaigoo Pipeline — PDO singleton

declare(strict_types=1);

require_once __DIR__ . '/config.php';

/**
 * Retorna singleton PDO configurado para MySQL.
 *
 * Em caso de falha de conexão envia JSON 500 e encerra a execução,
 * garantindo que nenhum endpoint vaze stack trace em produção.
 *
 * @return PDO
 */
function getPDO(): PDO
{
    /** @var PDO|null */
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_CHARSET
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::ATTR_TIMEOUT            => 5,
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci',
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        // Não expor credenciais nem DSN no erro retornado.
        $isDev = defined('APP_ENV') && APP_ENV !== 'production';
        $detail = $isDev ? $e->getMessage() : 'Database connection failed';

        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(
            ['error' => 'Database connection failed', 'detail' => $detail],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
        exit;
    }

    return $pdo;
}
