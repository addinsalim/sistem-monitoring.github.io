<?php
/**
 * Auto Setup / Migrasi Database MySQL
 * Menjalankan pembuatan database 'stikom_air_quality' dan tabel-tabelnya secara otomatis.
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = '127.0.0.1';
$port = 3306;
$user = 'root';
$pass = '';

try {
    // 1. Koneksi ke server MySQL tanpa memilih database
    $pdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    // 2. Baca file database.sql
    $sqlFile = dirname(__DIR__) . '/database.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("File database.sql tidak ditemukan di: {$sqlFile}");
    }

    $sqlContent = file_get_contents($sqlFile);

    // 3. Jalankan query SQL
    $pdo->exec($sqlContent);

    // 4. Verifikasi jumlah data
    $pdo->exec("USE `stikom_air_quality`");
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM `sensor_readings`");
    $totalReadings = $stmt->fetchColumn();

    $stmt2 = $pdo->query("SELECT COUNT(*) as total FROM `devices`");
    $totalDevices = $stmt2->fetchColumn();

    http_response_code(200);
    echo json_encode([
        'status'         => 'success',
        'message'        => 'Database stikom_air_quality dan tabel berhasil dibuat!',
        'database'       => 'stikom_air_quality',
        'total_devices'  => (int)$totalDevices,
        'total_readings' => (int)$totalReadings,
        'phpmyadmin_url' => 'http://localhost/phpmyadmin/index.php?route=/database/structure&db=stikom_air_quality'
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Gagal menginisialisasi database. Pastikan MySQL di XAMPP Control Panel sudah berstatus [Start/Running].',
        'error'   => $e->getMessage()
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
