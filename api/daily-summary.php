<?php
/**
 * Endpoint: GET /api/daily-summary.php
 * Ringkasan tren polutan harian (7 hari terakhir) untuk visualisasi grafik
 */

require_once __DIR__ . '/config/db.php';

try {
    $sql = "SELECT
                DATE(created_at) as raw_date,
                DATE_FORMAT(created_at, '%d %b') as date,
                ROUND(AVG(pm25), 1) as pm25Avg,
                ROUND(AVG(asap_rokok), 1) as asapRokokAvg,
                ROUND(AVG(asap_kendaraan), 1) as asapKendaraanAvg,
                ROUND(MAX(pm25), 1) as maxPm25
            FROM `sensor_readings`
            GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%d %b')
            ORDER BY raw_date ASC
            LIMIT 7";

    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();

    $data = [];
    foreach ($rows as $r) {
        $data[] = [
            'date'             => $r['date'],
            'pm25Avg'          => (float)$r['pm25Avg'],
            'asapRokokAvg'     => (float)$r['asapRokokAvg'],
            'asapKendaraanAvg' => (float)$r['asapKendaraanAvg'],
            'maxPm25'          => (float)$r['maxPm25'],
        ];
    }

    echo json_encode([
        'status' => 'success',
        'data'   => $data
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Gagal mengambil daily summary: ' . $e->getMessage()
    ]);
}

