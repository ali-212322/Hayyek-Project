# 📘 Hayyek App - Technical Documentation

---

## 📖 1. Project Overview

Hayyek is a neighborhood-based service platform that connects residents with nearby service providers in real time.

The application allows users to easily find and request services such as:

* Home cleaning
* Car washing
* Home maintenance
* Other local services

The goal is to improve convenience, سرعة الوصول للخدمات، ودعم مقدمي الخدمات داخل الحي.

---

## 👤 2. User Stories

### 🔹 Resident (User)

* As a user, I want to create an account and login securely
* As a user, I want to view nearby available workers
* As a user, I want to request a service بسهولة
* As a user, I want to see worker ratings قبل الطلب

### 🔹 Service Provider (Worker)

* As a worker, I want to register and list my services
* As a worker, I want to update availability (online/offline)
* As a worker, I want to receive service requests

### 🔹 Admin

* As an admin, I want to manage users and workers
* As an admin, I want to monitor service quality

---

## 🎨 3. Mockups

(Add Figma or design links here)

Main Screens:

* Home (Nearby Services)
* Service Request Page
* Worker Profile
* Dashboard

---

## 🏗️ 4. System Architecture

Architecture Style: Client-Server Architecture

### Components:

* Frontend: React.js
* Backend: Node.js (Express)
* Database: MongoDB

### Flow:

User → Frontend → Backend API → Database → Response → Frontend

---

## 🧩 5. Components & System Structure

### Backend Structure:

* **Controllers** → Handle requests
* **Routes** → API endpoints
* **Models** → Database schemas
* **Services** → Business logic

### Main Modules:

* Authentication Module
* User Management
* Service Management
* Request Handling

---

## 🗄️ 6. Database Design

### Collections:

#### Users

* id
* name
* email
* password
* role (user / worker / admin)

#### Services

* id
* title
* description
* category (cleaning, maintenance, etc.)
* workerId

#### Requests

* id
* userId
* workerId
* serviceId
* status (pending / accepted / completed)

#### Reviews

* id
* userId
* workerId
* rating
* comment

---

## 🔄 7. Sequence Diagram (Service Request)

1. User selects a service
2. App shows nearby available workers
3. User sends request
4. Backend stores request
5. Worker receives notification
6. Worker accepts/rejects
7. Status updated in database
8. User sees result

---

## 🔌 8. API Specifications

### Base URL:

/api/v1

### 🔹 Auth

* POST /auth/register
* POST /auth/login

### 🔹 Users

* GET /users
* GET /users/:id

### 🔹 Services

* GET /services
* POST /services

### 🔹 Requests

* POST /requests
* GET /requests/:id
* PATCH /requests/:id

---

## 🔧 9. SCM Strategy (Git)

### Branching Strategy:

* main → production
* develop → development
* feature/* → new features

### Workflow:

1. Create feature branch
2. Commit regularly
3. Push to GitHub
4. Open Pull Request
5. Code Review
6. Merge to develop → main

---

## 🧪 10. QA Strategy

### Testing Types:

* Unit Testing (Jest)
* API Testing (Postman)
* Manual Testing

### Key Test Cases:

* User login/logout
* Service creation
* Request flow (send / accept / complete)
* Error handling

---

## ⚙️ 11. Technical Decisions

### Node.js + Express

* Fast and scalable backend
* Suitable for real-time requests

### MongoDB

* Flexible schema for dynamic services
* Easy integration with Node.js

### React

* Fast and responsive UI
* Component-based architecture

---

## 📌 12. Technical Justifications

* Real-time service matching requires a lightweight and fast backend
* NoSQL database fits dynamic service categories
* Modular backend structure improves scalability and maintainability

---

## 🚀 13. Future Improvements

* Real-time tracking (GPS)
* In-app chat between user and worker
* Payment integration
* Rating and recommendation system

---

## 🔗 Project Link

https://github.com/ali-212322/Hayyek-Project

