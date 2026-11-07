<?php
/**
 * Diagnostic & Health Check Endpoint
 * Buka di browser: http://localhost/stikom-air-quality-frontend/api/test.php
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");

$host = '127.0.0.1';
$port = 3306;
$db   = 'stikom_air_quality';
$user = 'root';
$pass = '';

$status = [
    'php_version'   => phpversion(),
    'mysql_service' => false,
    'db_exists'     => false,
    'tables'        => [],
    'error'         => null
];

try {
    $pdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    $status['mysql_service'] = true;

    // Cek database
    $stmt = $pdo->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '{$db}'");
    if ($stmt->fetch()) {
        $status['db_exists'] = true;
        $pdo->exec("USE `{$db}`");
        $tStmt = $pdo->query("SHOW TABLES");
        $status['tables'] = $tStmt->fetchAll(PDO::FETCH_COLUMN);
    }
} catch (Exception $e) {
    $status['error'] = $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Status Database & API — STIKOM Air Quality</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #081226; color: #e8f2ff; padding: 30px; margin: 0; }
    .card { max-width: 650px; margin: 0 auto; background: #0e1e36; border: 1px solid #1c3352; border-radius: 12px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h1 { font-size: 20px; color: #38bdf8; margin-top: 0; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #162a42; font-size: 13px; }
    .badge-ok { color: #4ade80; font-weight: bold; }
    .badge-err { color: #f87171; font-weight: bold; }
    .btn { display: inline-block; background: #0284c7; color: white; text-decoration: none; padding: 10px 16px; border-radius: 6px; font-weight: bold; margin-top: 15px; font-size: 13px; }
    .btn:hover { background: #0369a1; }
    pre { background: #060d1a; padding: 12px; border-radius: 6px; font-size: 11px; overflow-x: auto; color: #a5b4fc; }
  </style>
</head>
<body>
  <div class="card">
    <h1>AirWatch — Diagnostik Database XAMPP</h1>
    <div class="row">
      <span>Versi PHP:</span>
      <b><?= $status['php_version']; ?></b>
    </div>
    <div class="row">
      <span>Status MySQL Server (Port 3306):</span>
      <span class="<?= $status['mysql_service'] ? 'badge-ok' : 'badge-err'; ?>">
        <?= $status['mysql_service'] ? '● AKTIF (Connected)' : '● MATI (Belum start)'; ?>
      </span>
    </div>
    <div class="row">
      <span>Database `stikom_air_quality`:</span>
      <span class="<?= $status['db_exists'] ? 'badge-ok' : 'badge-err'; ?>">
        <?= $status['db_exists'] ? '● TERSEDIA' : '● BELUM DIBUAT'; ?>
      </span>
    </div>
    <div class="row">
      <span>Tabel Terdeteksi:</span>
      <span><?= !empty($status['tables']) ? implode(', ', $status['tables']) : '—'; ?></span>
    </div>

    <?php if ($status['error']): ?>
      <div style="margin-top: 15px; padding: 12px; background: #261215; border-left: 4px solid #f87171; border-radius: 4px;">
        <b style="color: #fca5a5;">Pesan Error:</b>
        <p style="margin: 5px 0 0; font-size: 12px; color: #fecaca;"><?= htmlspecialchars($status['error']); ?></p>
      </div>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 12px;">
        💡 <b>Solusi:</b> Buka <b>XAMPP Control Panel</b>, lalu klik tombol <b>Start</b> pada baris <b>MySQL</b> dan <b>Apache</b>.
      </p>
    <?php elseif (!$status['db_exists']): ?>
      <p style="font-size: 13px; color: #94a3b8; margin-top: 15px;">
        MySQL aktif, namun database belum diinisialisasi. Klik tombol di bawah untuk membuat database secara otomatis:
      </p>
      <a href="setup.php" class="btn">⚡ Jalankan Auto Setup Database</a>
    <?php else: ?>
      <p style="font-size: 13px; color: #4ade80; margin-top: 15px;">
        ✅ Semua sistem database dan tabel siap digunakan oleh frontend dan firmware ESP32!
      </p>
      <a href="http://localhost/phpmyadmin/index.php?route=/database/structure&db=stikom_air_quality" target="_blank" class="btn" style="background: #0f766e;">
        Buka di phpMyAdmin ↗
      </a>
    <?php endif; ?>
  </div>
</body>
</html>

