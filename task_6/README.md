# 📘 Hayyek App - Technical Documentation

---

## 📖 1. Project Overview

Hayyek is a neighborhood-based service platform that connects residents with nearby service providers in real time.

The application allows users to easily find and request services such as:

* Home cleaning
* Car washing
* Home maintenance
* Other local services

The goal is to improve convenience, faster access to services, and support local workers within the neighborhood.

---

## 👤 2. User Stories

### 🔹 Resident (User)

* Create an account and login
* View nearby available workers
* Request services easily
* View worker ratings before requesting

### 🔹 Service Provider (Worker)

* Register and list services
* Update availability (online/offline)
* Receive and respond to service requests

### 🔹 Admin

* Manage users and workers
* Monitor services and content

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

Architecture Style: Client-Server

### Components:

* Frontend: React.js
* Backend: Node.js (Express)
* Database: MongoDB

### Flow:

User → Frontend → Backend API → Database → Response → Frontend

### Architecture Diagram

```
Client (React)
     ↓
API Server (Node.js / Express)
     ↓
Database (MongoDB)
```

---

## 🧩 5. Components & System Structure

### Backend Structure:

* Controllers → Handle requests
* Routes → API endpoints
* Models → Database schemas
* Services → Business logic

### Main Modules:

* Authentication
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
* category
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

### ER Diagram

```
User ────< Request >──── Worker
   \                     /
    \                   /
     └──── Review ─────┘

Service ────< Request
```

---

## 🔄 7. Sequence Diagram

### Service Request Flow

User → Frontend → Backend → Database
Backend → Worker (notification)
Worker → Backend (accept/reject)
Backend → User (response)

---

## 🔌 8. API Specifications

### Base URL:

/api/v1

### Auth

* POST /auth/register
* POST /auth/login

### Users

* GET /users
* GET /users/:id

### Services

* GET /services
* POST /services

### Requests

* POST /requests
* GET /requests/:id
* PATCH /requests/:id

---

## 🔧 9. SCM Strategy (Task 5)

### Branching Strategy

* main → production
* develop → development
* feature/* → feature development

### Workflow

1. Create feature branch from develop
2. Commit regularly (small commits)
3. Push to GitHub
4. Open Pull Request
5. Code review
6. Merge into develop
7. Merge develop → main when stable

---

## 🧪 10. QA Strategy (Task 5)

### Testing Types

* Unit Testing (Jest)
* Integration Testing
* API Testing (Postman / Supertest)
* Manual Testing

### Key Test Cases

* User authentication
* Service creation
* Request lifecycle (send / accept / complete)
* Error handling

---

## 🚀 11. Deployment Pipeline

### Staging

* Code from develop is deployed for testing

### Production

* Code from main is deployed after approval

---

## ⚙️ 12. Technical Decisions

### Node.js + Express

* Fast and scalable backend

### MongoDB

* Flexible schema for dynamic services

### React

* Fast UI and reusable components

---

## 📌 13. Technical Justifications

* Real-time service matching requires a lightweight backend
* NoSQL database supports flexible data structure
* Modular architecture improves scalability

---

## 🚀 14. Future Improvements

* GPS tracking for workers
* Real-time notifications
* In-app chat
* Payment integration

---

## 🔗 Project Link

https://github.com/ali-212322/Hayyek-Project

