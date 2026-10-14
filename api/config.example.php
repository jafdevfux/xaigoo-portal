<?php

// SPDX-License-Identifier: MIT
// Xaigoo Pipeline — API config example
// Copie este arquivo para config.php e preencha com dados reais do cPanel HomeHost.

declare(strict_types=1);

/**
 * Como obter no cPanel HomeHost:
 * 1. Acesse cPanel > MySQL Databases (ou "Bancos de Dados MySQL")
 * 2. Em "Bancos de Dados Atuais" copie o nome completo (ex: homehost_xaigoo)
 * 3. Em "Usuários MySQL" copie o usuário (ex: homehost_api)
 * 4. Host costuma ser mysql.homehost.com.br — confirme em cPanel > MySQL > Informações do servidor
 * 5. Porta padrão MySQL: 3306
 *
 * IMPORTANTE: nunca commite config.php com credenciais reais. Apenas config.example.php vai para o git.
 */

// -- Banco de dados ---------------------------------------------------------
define('DB_HOST', 'mysql.homehost.com.br');
define('DB_PORT', '3306');
define('DB_NAME', 'homehost_xaigoo_db');
define('DB_USER', 'homehost_xaigoo_user');
define('DB_PASS', 'troque_por_senha_forte_aqui');
define('DB_CHARSET', 'utf8mb4');

// -- Aplicação --------------------------------------------------------------
define('APP_ENV', 'production'); // 'production' | 'development' | 'testing'

// -- CORS -------------------------------------------------------------------
// Lista separada por vírgula de origens permitidas. Use * apenas em dev.
// Em produção na HomeHost, liste apenas o domínio real do frontend.
define('CORS_ALLOWED_ORIGINS', 'https://www.xaigoo.app,https://xaigoo.app');

// Exemplo para desenvolvimento local (Vite em :3000):
// define('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000');

// -- Timezone ---------------------------------------------------------------
date_default_timezone_set('America/Sao_Paulo');
