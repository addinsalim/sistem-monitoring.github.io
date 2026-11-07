<?php
/**
 * Koneksi Database MySQL (XAMPP) via PDO
 * Sistem Monitoring Kualitas Udara STIKOM El Rahma Bogor
 */

// Header CORS agar dapat diakses oleh frontend (Vite dev server di port 5173 atau Apache)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_host = '127.0.0.1';
$db_port = 3306;
$db_name = 'stikom_air_quality';
$db_user = 'root';
$db_pass = ''; // Default XAMPP password root adalah kosong

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Gagal terhubung ke database MySQL. Pastikan service MySQL di XAMPP Control Panel sudah aktif (Running).',
        'detail'  => $e->getMessage()
    ]);
    exit();
}
