<?php
/**
 * Endpoint: GET /api/history.php
 * Mengambil daftar riwayat pembacaan sensor dengan filter dan pencarian
 */

require_once __DIR__ . '/config/db.php';

try {
    $limit  = isset($_GET['limit']) ? min(200, max(1, (int)$_GET['limit'])) : 50;
    $status = isset($_GET['status']) && $_GET['status'] !== 'Semua' ? trim($_GET['status']) : null;
    $date   = isset($_GET['date']) && $_GET['date'] !== 'Semua' ? trim($_GET['date']) : null;
    $search = isset($_GET['q']) ? trim($_GET['q']) : null;

    $where = [];
    $params = [];

    if ($status) {
        $where[] = "status = :status";
        $params[':status'] = $status;
    }

    if ($date) {
        $where[] = "DATE(created_at) = :date";
        $params[':date'] = $date;
    }

    if ($search) {
        $where[] = "(device_id LIKE :q1 OR pm25 LIKE :q2 OR asap_rokok LIKE :q3 OR status LIKE :q4)";
        $params[':q1'] = "%{$search}%";
        $params[':q2'] = "%{$search}%";
        $params[':q3'] = "%{$search}%";
        $params[':q4'] = "%{$search}%";
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "SELECT id, device_id, pm25, asap_rokok, asap_kendaraan, suhu, kelembapan, status, created_at
            FROM `sensor_readings`
            {$whereClause}
            ORDER BY created_at DESC
            LIMIT {$limit}";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $results = [];
    foreach ($rows as $r) {
        $dt = new DateTime($r['created_at']);
        $results[] = [
            'id'            => (int)$r['id'],
            'deviceId'      => $r['device_id'],
            'date'          => $dt->format('d M Y'),
            'time'          => $dt->format('d M Y · H:i'),
            'pm25'          => (float)$r['pm25'],
            'asapRokok'     => (float)$r['asap_rokok'],
            'asapKendaraan' => (float)$r['asap_kendaraan'],
            'suhu'          => $r['suhu'] !== null ? (float)$r['suhu'] : null,
            'kelembapan'    => $r['kelembapan'] !== null ? (float)$r['kelembapan'] : null,
            'status'        => $r['status'],
            'createdAt'     => $r['created_at']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'count'  => count($results),
        'data'   => $results
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Gagal mengambil riwayat sensor: ' . $e->getMessage()
    ]);
}

