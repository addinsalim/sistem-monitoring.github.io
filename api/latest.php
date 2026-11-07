<?php
/**
 * Endpoint: GET /api/latest.php
 * Mengambil pembacaan sensor terbaru dari database
 */

require_once __DIR__ . '/config/db.php';

try {
    $sql = "SELECT r.*, d.name as device_name, d.location as device_location, d.status as device_status
            FROM `sensor_readings` r
            LEFT JOIN `devices` d ON r.device_id = d.device_id
            ORDER BY r.created_at DESC, r.id DESC
            LIMIT 1";

    $stmt = $pdo->query($sql);
    $row = $stmt->fetch();

    if (!$row) {
        // Fallback default jika tabel masih kosong
        echo json_encode([
            'status' => 'success',
            'data' => [
                'pm25'          => 18,
                'asapRokok'     => 7,
                'asapKendaraan' => 12,
                'suhu'          => 28,
                'kelembapan'    => 65,
                'status'        => 'Baik',
                'time'          => date('d M Y · H:i'),
                'deviceId'      => 'parkir-esp32-01',
                'location'      => 'Area Parkir STIKOM El Rahma Bogor',
                'isLive'        => false
            ]
        ]);
        exit();
    }

    $createdAt = new DateTime($row['created_at']);
    $dateFormatted = $createdAt->format('d M Y · H:i');

    echo json_encode([
        'status' => 'success',
        'data' => [
            'id'            => (int)$row['id'],
            'deviceId'      => $row['device_id'],
            'deviceName'    => $row['device_name'] ?? 'ESP32 Gateway',
            'location'      => $row['device_location'] ?? 'Area Parkir STIKOM El Rahma Bogor',
            'pm25'          => (float)$row['pm25'],
            'asapRokok'     => (float)$row['asap_rokok'],
            'asapKendaraan' => (float)$row['asap_kendaraan'],
            'suhu'          => $row['suhu'] !== null ? (float)$row['suhu'] : null,
            'kelembapan'    => $row['kelembapan'] !== null ? (float)$row['kelembapan'] : null,
            'status'        => $row['status'],
            'time'          => $dateFormatted,
            'createdAt'     => $row['created_at'],
            'isLive'        => true
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Gagal mengambil data sensor terbaru: ' . $e->getMessage()
    ]);
}

