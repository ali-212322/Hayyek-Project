-- =========================
-- Hayyek Database - Clean Structure
-- =========================

CREATE DATABASE IF NOT EXISTS hayyek
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE hayyek;

-- =========================
-- Neighborhoods Table
-- =========================
CREATE TABLE IF NOT EXISTS neighborhoods (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- =========================
-- Users Table
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    neighborhood_id INT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id)
        ON DELETE SET NULL
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
-- Orders Table (Requests)
-- =========================
CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    service_id INT UNSIGNED NOT NULL,
    status ENUM('pending','in_progress','completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id)
        ON DELETE CASCADE
);

-- =========================
-- Seed Data
-- =========================

INSERT INTO neighborhoods (name) VALUES
('Al Narjis'),
('Al Malqa'),
('Al Yasmin');

INSERT INTO users (name, neighborhood_id) VALUES
('Faisal', 1),
('Mohammed', 2);

INSERT INTO services (name, price) VALUES
('Cleaning', 50.00),
('Delivery', 20.00),
('Plumbing', 80.00);

INSERT INTO orders (user_id, service_id, status) VALUES
(1, 1, 'pending'),
(2, 2, 'completed');