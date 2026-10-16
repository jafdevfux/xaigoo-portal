<?php
// Temporário — apagar imediatamente depois!
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
header('Content-Type: text/plain; charset=utf-8');
$pdo = getPDO();
$stmt = $pdo->prepare("DELETE FROM users WHERE email = :email");
$stmt->execute([':email' => 'josiel@xaigoo.app']);
echo "Deletados: " . $stmt->rowCount() . " registro(s)\n";
$stmt2 = $pdo->query("SELECT COUNT(*) as total FROM users");
echo "Users restantes: " . $stmt2->fetch()['total'] . "\n";
