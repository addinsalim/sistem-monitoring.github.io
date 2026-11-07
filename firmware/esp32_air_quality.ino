/*
 * ======================================================================================
 * PROJEK MONITORING KUALITAS UDARA AREA PARKIR STIKOM EL RAHMA BOGOR
 * Firmware Mikrokontroler: ESP32 (NodeMCU-32S / ESP-WROOM-32)
 *
 * Sensor yang digunakan:
 * 1. Sharp GP2Y1010AU0F (Sensor Debu PM2.5) -> Pin Analog ADC (GPIO 34) & Pulse Pin (GPIO 14)
 * 2. MQ-2 (Sensor Gas & Asap)             -> Pin Analog ADC (GPIO 35)
 * 3. DHT22 (Sensor Suhu & Kelembapan)     -> Pin Digital (GPIO 4)
 *
 * Mengirim data telemetri JSON via HTTP POST ke Server Backend XAMPP:
 * Endpoint: http://<IP_KOMPUTER_SERVER>/stikom-air-quality-frontend/api/telemetry.php
 * ======================================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// -----------------------------------------------------------------------------
// KONFIGURASI WI-FI & SERVER XAMPP
// -----------------------------------------------------------------------------
const char* WIFI_SSID     = "WIFI_KAMPUS_ELRAHMA"; // Ganti dengan nama Wi-Fi Anda
const char* WIFI_PASSWORD = "PASSWORD_WIFI";       // Ganti dengan password Wi-Fi Anda

// Ganti IP dengan IP komputer yang menjalankan XAMPP (lihat dengan perintah 'ipconfig' di CMD)
// Contoh: "http://192.168.0.113/stikom-air-quality-frontend/api/telemetry.php"
const char* SERVER_URL    = "http://192.168.0.113/stikom-air-quality-frontend/api/telemetry.php";

const char* DEVICE_ID     = "parkir-esp32-01";
const unsigned long INTERVAL_MS = 10000; // Interval pengiriman data (10 detik)

// -----------------------------------------------------------------------------
// PIN DEFINITION SENSOR
// -----------------------------------------------------------------------------
// 1. Sharp GP2Y1010AU0F
#define PIN_SHARP_VO    34 // Pin VO (Analog Out) ke GPIO 34 (ADC1)
#define PIN_SHARP_LED   14 // Pin ILED (Infrared LED) ke GPIO 14 (Digital Out)

// 2. MQ-2 Gas & Smoke Sensor
#define PIN_MQ2_AO      35 // Pin AO (Analog Out) ke GPIO 35 (ADC1)

// 3. DHT22 Suhu & Kelembapan
#define PIN_DHT         4  // Pin Data DHT ke GPIO 4
#define DHTTYPE         DHT22
DHT dht(PIN_DHT, DHTTYPE);

// -----------------------------------------------------------------------------
// VARIABEL PENDUKUNG
// -----------------------------------------------------------------------------
unsigned long lastSendTime = 0;

// Fungsi membaca konsentrasi debu PM2.5 dari sensor Sharp GP2Y1010AU0F
float readPM25() {
  digitalWrite(PIN_SHARP_LED, LOW); // Aktifkan LED IR sensor (active LOW)
  delayMicroseconds(280);

  int voRaw = analogRead(PIN_SHARP_VO); // Baca nilai ADC
  delayMicroseconds(40);
  digitalWrite(PIN_SHARP_LED, HIGH); // Matikan LED IR
  delayMicroseconds(9680);

  // Konversi ADC ESP32 (12-bit: 0 - 4095) ke Tegangan (0 - 3.3V)
  float voltage = (voRaw / 4095.0) * 3.3;

  // Rumus estimasi linier datasheet Sharp (Kondisi tegangan tanpa debu ~0.6V - 0.9V)
  // Dust Density (mg/m3) = (V - Voc) / K
  float dustDensity = 0.0;
  if (voltage > 0.6) {
    dustDensity = (voltage - 0.6) / 0.5 * 100.0; // ug/m3
  }
  return max(0.0f, dustDensity);
}

// Fungsi membaca sensor MQ-2 (Estimasi asap relatif)
float readMQ2Asap() {
  int rawADC = analogRead(PIN_MQ2_AO);
  // Konversi relatif ke ug/m3 untuk visualisasi dashboard
  float asapRelatif = (rawADC / 4095.0) * 80.0;
  return max(0.0f, asapRelatif);
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n==================================================");
  Serial.println("  SISTEM MONITORING KUALITAS UDARA - STIKOM BOGOR ");
  Serial.println("==================================================");

  // Inisialisasi Pin
  pinMode(PIN_SHARP_LED, OUTPUT);
  digitalWrite(PIN_SHARP_LED, HIGH);
  analogReadResolution(12); // Resolusi ADC 12-bit (0 - 4095)

  // Inisialisasi DHT
  dht.begin();

  // Koneksi ke Jaringan Wi-Fi
  Serial.print("Menghubungkan ke Wi-Fi: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 25) {
    delay(500);
    Serial.print(".");
    retry++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[OK] Terhubung ke Wi-Fi!");
    Serial.print("IP Address ESP32: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[WARNING] Gagal terhubung ke Wi-Fi. Mode offline.");
  }
}

void loop() {
  unsigned long now = millis();
  if (now - lastSendTime >= INTERVAL_MS) {
    lastSendTime = now;

    // 1. Baca semua sensor
    float pm25          = readPM25();
    float asapRokok     = readMQ2Asap() * 0.45; // Rasio komponen asap halus
    float asapKendaraan = readMQ2Asap() * 0.75; // Rasio emisi gas hidrokarbon
    float suhu          = dht.readTemperature();
    float kelembapan    = dht.readHumidity();

    if (isnan(suhu)) suhu = 28.0;
    if (isnan(kelembapan)) kelembapan = 65.0;

    Serial.println("----------------------------------------------");
    Serial.printf("[SENSOR] PM2.5: %.1f ug/m3 | Asap: %.1f ug/m3 | Suhu: %.1f C | RH: %.1f %%\n",
                  pm25, asapRokok, suhu, kelembapan);

    // 2. Kirim data ke backend XAMPP via HTTP POST
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(SERVER_URL);
      http.addHeader("Content-Type", "application/json");

      // Format payload JSON
      String payload = "{";
      payload += "\"device_id\":\"" + String(DEVICE_ID) + "\",";
      payload += "\"pm25\":" + String(pm25, 2) + ",";
      payload += "\"asap_rokok\":" + String(asapRokok, 2) + ",";
      payload += "\"asap_kendaraan\":" + String(asapKendaraan, 2) + ",";
      payload += "\"suhu\":" + String(suhu, 1) + ",";
      payload += "\"kelembapan\":" + String(kelembapan, 1);
      payload += "}";

      Serial.println("[HTTP] Mengirim data ke server...");
      int httpResponseCode = http.POST(payload);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.printf("[HTTP %d] Respon Server: %s\n", httpResponseCode, response.c_str());
      } else {
        Serial.printf("[HTTP ERROR] Gagal mengirim, kode error: %s\n", http.errorToString(httpResponseCode).c_str());
      }

      http.end();
    } else {
      Serial.println("[WIFI] Wi-Fi terputus, mencoba rekoneksi...");
      WiFi.reconnect();
    }
  }
}
