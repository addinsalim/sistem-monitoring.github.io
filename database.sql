-- ============================================================
-- Database: stikom_air_quality
-- Sistem Monitoring Kualitas Udara Area Parkir STIKOM El Rahma Bogor
-- Target: MySQL / MariaDB (XAMPP)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `stikom_air_quality`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `stikom_air_quality`;

-- ------------------------------------------------------------
-- 1. Tabel Perangkat IoT (Devices)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `devices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `device_id` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `location` VARCHAR(150) NOT NULL DEFAULT 'Area Parkir STIKOM El Rahma Bogor',
  `ip_address` VARCHAR(45) NULL,
  `sampling_interval_sec` INT NOT NULL DEFAULT 10,
  `status` ENUM('Online', 'Offline', 'Maintenance') NOT NULL DEFAULT 'Online',
  `last_seen` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. Tabel Rekaman Telemetri Sensor (sensor_readings)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sensor_readings` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `device_id` VARCHAR(50) NOT NULL,
  `pm25` DECIMAL(6, 2) NOT NULL COMMENT 'Konsentrasi debu PM2.5 (ug/m3)',
  `asap_rokok` DECIMAL(6, 2) NOT NULL COMMENT 'Deteksi asap rokok relatif (ug/m3)',
  `asap_kendaraan` DECIMAL(6, 2) NOT NULL COMMENT 'Deteksi gas/asap kendaraan relatif (ug/m3)',
  `suhu` DECIMAL(4, 1) NULL COMMENT 'Suhu udara (Celcius)',
  `kelembapan` DECIMAL(4, 1) NULL COMMENT 'Kelembapan relatif (%)',
  `status` ENUM('Baik', 'Sedang', 'Tidak Sehat', 'Sangat Tidak Sehat', 'Berbahaya') NOT NULL DEFAULT 'Baik',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_device_time` (`device_id`, `created_at`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_sensor_device` FOREIGN KEY (`device_id`) REFERENCES `devices`(`device_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. Tabel Ambang Batas Parameter (threshold_settings)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `threshold_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `parameter_key` VARCHAR(50) NOT NULL UNIQUE,
  `parameter_label` VARCHAR(100) NOT NULL,
  `unit` VARCHAR(20) NOT NULL DEFAULT 'μg/m³',
  `batas_baik` DECIMAL(6, 2) NOT NULL,
  `batas_sedang` DECIMAL(6, 2) NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 4. Tabel Notifikasi & Log Peringatan (system_notifications)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('success', 'warning', 'info', 'danger') NOT NULL DEFAULT 'info',
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ============================================================
-- SEED DATA (DATA AWAL UNTUK PENGUJIAN)
-- ============================================================

-- Data Perangkat Default
INSERT INTO `devices` (`device_id`, `name`, `location`, `ip_address`, `sampling_interval_sec`, `status`, `last_seen`)
VALUES
('parkir-esp32-01', 'ESP32 Gateway Parkir 01', 'Area Parkir STIKOM El Rahma Bogor', '192.168.1.105', 10, 'Online', NOW())
ON DUPLICATE KEY UPDATE `last_seen` = NOW();

-- Ambang Batas Standar ISPU
INSERT INTO `threshold_settings` (`parameter_key`, `parameter_label`, `unit`, `batas_baik`, `batas_sedang`)
VALUES
('pm25', 'PM2.5 (Debu)', 'μg/m³', 35.00, 75.00),
('asap_rokok', 'Asap Rokok', 'μg/m³', 15.00, 30.00),
('asap_kendaraan', 'Asap Kendaraan', 'μg/m³', 20.00, 45.00)
ON DUPLICATE KEY UPDATE `batas_baik` = VALUES(`batas_baik`);

-- Notifikasi Awal
INSERT INTO `system_notifications` (`type`, `title`, `message`, `created_at`)
VALUES
('success', 'Kondisi udara normal', 'Semua parameter dalam batas aman.', NOW() - INTERVAL 1 HOUR),
('warning', 'Peningkatan PM2.5 terdeteksi', 'Nilai PM2.5 sempat meningkat menjadi 45 μg/m³ (masih dalam batas aman).', NOW() - INTERVAL 4 HOUR),
('info', 'Sistem monitoring aktif', 'Sensor Sharp GP2Y, MQ-2, DHT22, dan ESP32 berjalan normal.', NOW() - INTERVAL 8 HOUR);

-- Data Riwayat Sensor (Simulasi Riwayat 7 Hari)
INSERT INTO `sensor_readings` (`device_id`, `pm25`, `asap_rokok`, `asap_kendaraan`, `suhu`, `kelembapan`, `status`, `created_at`)
VALUES
('parkir-esp32-01', 14.0, 4.0, 7.0, 27.0, 68.0, 'Baik',   '2026-11-01 07:00:00'),
('parkir-esp32-01', 25.0, 7.0, 13.0, 29.0, 64.0, 'Baik',  '2026-11-01 09:30:00'),
('parkir-esp32-01', 42.0, 11.0, 21.0, 33.0, 58.0, 'Sedang','2026-11-01 12:00:00'),
('parkir-esp32-01', 37.0, 9.0, 19.0, 32.0, 60.0, 'Baik',  '2026-11-01 14:30:00'),
('parkir-esp32-01', 58.0, 15.0, 30.0, 30.0, 63.0, 'Sedang','2026-11-01 17:00:00'),
('parkir-esp32-01', 22.0, 6.0, 11.0, 28.0, 70.0, 'Baik',  '2026-11-01 19:30:00'),

('parkir-esp32-01', 18.0, 5.0, 9.0, 28.0, 67.0, 'Baik',   '2026-10-31 08:00:00'),
('parkir-esp32-01', 31.0, 8.0, 16.0, 30.0, 62.0, 'Baik',  '2026-10-31 10:30:00'),
('parkir-esp32-01', 47.0, 12.0, 24.0, 34.0, 55.0, 'Sedang','2026-10-31 13:00:00'),
('parkir-esp32-01', 35.0, 9.0, 18.0, 32.0, 59.0, 'Baik',  '2026-10-31 15:30:00'),
('parkir-esp32-01', 20.0, 6.0, 10.0, 29.0, 65.0, 'Baik',  '2026-10-31 18:00:00'),

('parkir-esp32-01', 16.0, 4.0, 8.0, 27.0, 69.0, 'Baik',   '2026-10-30 07:30:00'),
('parkir-esp32-01', 29.0, 8.0, 14.0, 31.0, 61.0, 'Baik',  '2026-10-30 10:00:00'),
('parkir-esp32-01', 52.0, 13.0, 26.0, 34.0, 54.0, 'Sedang','2026-10-30 12:30:00'),
('parkir-esp32-01', 39.0, 10.0, 20.0, 32.0, 58.0, 'Baik',  '2026-10-30 15:00:00'),
('parkir-esp32-01', 61.0, 16.0, 32.0, 30.0, 62.0, 'Sedang','2026-10-30 17:30:00'),

('parkir-esp32-01', 13.0, 4.0, 7.0, 26.0, 71.0, 'Baik',   '2026-10-29 07:00:00'),
('parkir-esp32-01', 24.0, 7.0, 12.0, 29.0, 64.0, 'Baik',  '2026-10-29 09:30:00'),
('parkir-esp32-01', 44.0, 11.0, 22.0, 33.0, 56.0, 'Sedang','2026-10-29 12:00:00'),
('parkir-esp32-01', 33.0, 9.0, 17.0, 31.0, 60.0, 'Baik',  '2026-10-29 14:30:00'),
('parkir-esp32-01', 19.0, 5.0, 10.0, 28.0, 67.0, 'Baik',  '2026-10-29 17:00:00'),

('parkir-esp32-01', 21.0, 6.0, 11.0, 28.0, 66.0, 'Baik',  '2026-10-28 08:00:00'),
('parkir-esp32-01', 36.0, 9.0, 18.0, 31.0, 60.0, 'Baik',  '2026-10-28 10:30:00'),
('parkir-esp32-01', 55.0, 14.0, 28.0, 35.0, 53.0, 'Sedang','2026-10-28 13:00:00'),
('parkir-esp32-01', 41.0, 10.0, 21.0, 32.0, 57.0, 'Sedang','2026-10-28 15:30:00'),
('parkir-esp32-01', 17.0, 5.0, 9.0, 29.0, 64.0, 'Baik',   '2026-10-28 18:00:00'),

('parkir-esp32-01', 18.0, 7.0, 12.0, 28.0, 65.0, 'Baik',  NOW());

