<?php
/**
 * Sensor Telemetry Simulator (Pengujian Input Sensor ke Database)
 *
 * Jalankan lewat browser: http://localhost/stikom-air-quality-frontend/scripts/simulate_sensor.php
 * Atau via terminal: php scripts/simulate_sensor.php
 */

header('Content-Type: text/html; charset=UTF-8');

$host = '127.0.0.1';
$user = 'root';
$pass = '';
$db   = 'stikom_air_quality';

$resultMsg = '';
$resultColor = '#38bdf8';

if (isset($_GET['action']) && $_GET['action'] === 'generate') {
    try {
        $pdo = new PDO("mysql:host={$host};dbname={$db};charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);

        $pm25 = isset($_GET['pm25']) && is_numeric($_GET['pm25']) ? (float)$_GET['pm25'] : rand(12, 65);
        $asapRokok = round($pm25 * 0.35 + rand(-2, 3), 1);
        $asapKendaraan = round($pm25 * 0.6 + rand(-3, 4), 1);
        $suhu = round(rand(260, 340) / 10, 1);
        $kelembapan = round(rand(550, 720) / 10, 1);

        if ($pm25 > 55.4) {
            $status = 'Tidak Sehat';
        } elseif ($pm25 > 15.4) {
            $status = 'Sedang';
        } else {
            $status = 'Baik';
        }

        $sql = "INSERT INTO `sensor_readings`
                (`device_id`, `pm25`, `asap_rokok`, `asap_kendaraan`, `suhu`, `kelembapan`, `status`, `created_at`)
                VALUES
                ('parkir-esp32-01', :pm25, :asap_rokok, :asap_kendaraan, :suhu, :kelembapan, :status, NOW())";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':pm25' => $pm25,
            ':asap_rokok' => max(1.0, $asapRokok),
            ':asap_kendaraan' => max(2.0, $asapKendaraan),
            ':suhu' => $suhu,
            ':kelembapan' => $kelembapan,
            ':status' => $status
        ]);

        $resultMsg = "Berhasil mengirim sampel! PM2.5: {$pm25} μg/m³, Status: {$status}, Suhu: {$suhu}°C";
        $resultColor = '#4ade80';
    } catch (Exception $e) {
        $resultMsg = "Error: " . $e->getMessage();
        $resultColor = '#f87171';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Simulator Sensor — STIKOM Air Quality</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #081226; color: #e8f2ff; padding: 30px; margin: 0; }
    .card { max-width: 600px; margin: 0 auto; background: #0e1e36; border: 1px solid #1c3352; border-radius: 12px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h1 { font-size: 19px; color: #38bdf8; margin-top: 0; }
    p { font-size: 12.5px; color: #94a3b8; line-height: 1.6; }
    .btn { display: inline-block; background: #0284c7; color: white; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; font-size: 13px; margin-right: 8px; margin-top: 10px; cursor: pointer; border: 0; }
    .btn:hover { background: #0369a1; }
    .btn-green { background: #059669; }
    .btn-amber { background: #d97706; }
    .btn-red { background: #dc2626; }
    .alert { padding: 12px; border-radius: 6px; font-size: 13px; margin-top: 15px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Simulator Injeksi Data Sensor (ESP32)</h1>
    <p>
      Gunakan alat ini untuk menguji penyimpanan data ke MySQL tanpa perlu menunggu mikrokontroler ESP32 fisik terhubung. Data yang dikirim akan langsung tersimpan di tabel <code>sensor_readings</code> dan otomatis muncul pada dashboard frontend.
    </p>

    <?php if ($resultMsg): ?>
      <div class="alert" style="background: <?= $resultColor; ?>22; color: <?= $resultColor; ?>; border: 1px solid <?= $resultColor; ?>55;">
        <?= htmlspecialchars($resultMsg); ?>
      </div>
    <?php endif; ?>

    <div style="margin-top: 20px;">
      <b>Kirim Sampel Kategori:</b><br>
      <a href="?action=generate&pm25=14" class="btn btn-green">🟢 Kirim Kondisi Baik (14 μg/m³)</a>
      <a href="?action=generate&pm25=42" class="btn btn-amber">🟡 Kirim Kondisi Sedang (42 μg/m³)</a>
      <a href="?action=generate&pm25=68" class="btn btn-red">🔴 Kirim Kondisi Tidak Sehat (68 μg/m³)</a>
      <a href="?action=generate" class="btn" style="background: #475569;">🎲 Kirim Nilai Acak</a>
    </div>

    <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #1a2f4a; display: flex; justify-content: space-between; font-size: 11.5px;">
      <a href="http://localhost:5173/" target="_blank" style="color: #38bdf8; text-decoration: none;">Lihat Dashboard Frontend ↗</a>
      <a href="http://localhost/phpmyadmin/index.php?route=/sql&db=stikom_air_quality&table=sensor_readings" target="_blank" style="color: #a78bfa; text-decoration: none;">Buka Tabel di phpMyAdmin ↗</a>
    </div>
  </div>
</body>
</html>

