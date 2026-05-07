-- =========================
-- Hayyek Project Database
-- Initial Clean Setup
-- =========================

CREATE DATABASE IF NOT EXISTS hayyek
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE hayyek;

-- =========================
-- Users Table
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Services Table
-- =========================
CREATE TABLE IF NOT EXISTS services (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Sample Data (Seed)
-- =========================
INSERT INTO users (name) VALUES
('Ahmed'),
('Mohammed');

INSERT INTO services (name, price) VALUES
('Home Cleaning', 50.00),
('Delivery Service', 20.00);