/* eslint-disable @typescript-eslint/no-explicit-any */
import mysql from "mysql2/promise";

// Hàm helper để xử lý nội dung chứng chỉ từ biến môi trường
function processCertContent(certContent: string): string {
  // Thay thế \n bằng xuống dòng thực
  return certContent.replace(/\\n/g, "\n");
}

// Hàm helper để tạo cấu hình SSL
function createSSLConfig() {
  if (process.env.MYSQL_SSL_ENABLED !== "true") {
    return false;
  }

  const sslConfig: any = {
    rejectUnauthorized: process.env.MYSQL_SSL_REJECT_UNAUTHORIZED !== "false",
  };

  // Xử lý CA certificate
  if (process.env.MYSQL_SSL_CA && process.env.MYSQL_SSL_CA.trim()) {
    const caContent = process.env.MYSQL_SSL_CA.trim();
    if (caContent.includes("-----BEGIN")) {
      sslConfig.ca = processCertContent(caContent);
    }
  }

  // Xử lý client certificate
  if (process.env.MYSQL_SSL_CERT && process.env.MYSQL_SSL_CERT.trim()) {
    const certContent = process.env.MYSQL_SSL_CERT.trim();
    if (certContent.includes("-----BEGIN")) {
      sslConfig.cert = processCertContent(certContent);
    }
  }

  // Xử lý private key
  if (process.env.MYSQL_SSL_KEY && process.env.MYSQL_SSL_KEY.trim()) {
    const keyContent = process.env.MYSQL_SSL_KEY.trim();
    if (keyContent.includes("-----BEGIN")) {
      sslConfig.key = processCertContent(keyContent);
    }
  }

  return sslConfig;
}

// Create connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  ssl: createSSLConfig(),
});

export default pool;
