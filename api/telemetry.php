<?php
/**
 * Endpoint: POST /api/telemetry.php
 * Ingestion data sensor dari ESP32 ke MySQL
 */

require_once __DIR__ . '/config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Hanya menerima request HTTP POST dari mikrokontroler ESP32 atau sensor gateway.'
    ]);
    exit();
}

// Baca raw body JSON
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Format JSON tidak valid atau kosong.'
    ]);
    exit();
}

$deviceId      = !empty($data['device_id']) ? trim($data['device_id']) : 'parkir-esp32-01';
$pm25          = isset($data['pm25']) ? (float)$data['pm25'] : 0.0;
$asapRokok     = isset($data['asap_rokok']) ? (float)$data['asap_rokok'] : (isset($data['asapRokok']) ? (float)$data['asapRokok'] : 0.0);
$asapKendaraan = isset($data['asap_kendaraan']) ? (float)$data['asap_kendaraan'] : (isset($data['asapKendaraan']) ? (float)$data['asapKendaraan'] : 0.0);
$suhu          = isset($data['suhu']) ? (float)$data['suhu'] : null;
$kelembapan    = isset($data['kelembapan']) ? (float)$data['kelembapan'] : null;

// Tentukan status kualitas udara berdasarkan standar ISPU PM2.5 (PP No.22/2021)
if ($pm25 > 250.4) {
    $status = 'Berbahaya';
} elseif ($pm25 > 150.4) {
    $status = 'Sangat Tidak Sehat';
} elseif ($pm25 > 55.4) {
    $status = 'Tidak Sehat';
} elseif ($pm25 > 15.4) {
    $status = 'Sedang';
} else {
    $status = 'Baik';
}

try {
    // 1. Pastikan device terdaftar di tabel devices
    $checkDev = $pdo->prepare("INSERT INTO `devices` (`device_id`, `name`, `last_seen`)
                               VALUES (:dev_id, 'ESP32 Gateway Parkir', NOW())
                               ON DUPLICATE KEY UPDATE `last_seen` = NOW()");
    $checkDev->execute([':dev_id' => $deviceId]);

    // 2. Simpan rekaman telemetri
    $sql = "INSERT INTO `sensor_readings`
            (`device_id`, `pm25`, `asap_rokok`, `asap_kendaraan`, `suhu`, `kelembapan`, `status`, `created_at`)
            VALUES
            (:device_id, :pm25, :asap_rokok, :asap_kendaraan, :suhu, :kelembapan, :status, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':device_id'      => $deviceId,
        ':pm25'           => $pm25,
        ':asap_rokok'     => $asapRokok,
        ':asap_kendaraan' => $asapKendaraan,
        ':suhu'           => $suhu,
        ':kelembapan'     => $kelembapan,
        ':status'         => $status
    ]);

    $insertedId = $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'status'     => 'success',
        'message'    => 'Data telemetri berhasil disimpan ke database.',
        'inserted_id'=> (int)$insertedId,
        'calculated' => [
            'pm25'   => $pm25,
            'status' => $status
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Gagal menyimpan data ke database: ' . $e->getMessage()
    ]);
}

