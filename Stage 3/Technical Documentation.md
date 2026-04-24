# 📘 Technical Documentation — "Hayyak" Project
### Hayyak Platform — Stage 3 Deliverable

---

| Field | Value |
|---|---|
| **Project Name** | Hayyek |
| **Project Type** | Multi-interface Digital Platform (Web + Mobile) |
| **Stage** | Stage 3 — Technical Documentation |
| **Document Version** | 1.0 |
| **Date** | April 2026 |

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [User Stories and Mockups](#2-user-stories-and-mockups)
3. [System Architecture](#3-system-architecture)
4. [Components, Classes, and Database Design](#4-components-classes-and-database-design)
5. [Sequence Diagrams](#5-sequence-diagrams)
6. [API Specifications](#6-api-specifications)
7. [SCM and QA Strategies](#7-scm-and-qa-strategies)
8. [Technical Justifications](#8-technical-justifications)

---

## 1. Project Overview

**Hayyak** is a smart digital platform that connects neighborhood residents with local service providers. The system consists of three interfaces:

| Interface | Target User | Technology |
|---|---|---|
| **Mobile App** | Neighborhood Residents (Beneficiaries) | React Native |
| **Providers Web Portal** | Service Providers | React (SPA) |
| **Admin Dashboard** | Platform Administrators | React (SPA) |

All three interfaces connect to a **unified Backend** built on Django REST Framework with a PostgreSQL database.

---

## 2. User Stories and Mockups

### 2.1 Priority Classification (MoSCoW)

Stories are prioritized for MVP implementation:

- **Must Have (M):** Essential for launch
- **Should Have (S):** Important but can be deferred
- **Could Have (C):** Desirable for enhancement
- **Won't Have (W):** Out of current MVP scope

---

### 2.2 User Stories — Residents

| # | Priority | User Story |
|---|---|---|
| R1 | **M** | As a **resident**, I want to **sign up and log in using my phone number**, so that **I can access my neighborhood's services**. |
| R2 | **M** | As a **resident**, I want to **set my geographic location on the map**, so that **the nearest service providers are displayed to me**. |
| R3 | **M** | As a **resident**, I want to **browse services by category** (maintenance, cleaning, groceries, restaurants, laundry, delivery), so that **I can quickly find what I need**. |
| R4 | **M** | As a **resident**, I want to **place an order and specify its details**, so that **the service provider reaches me at the right time**. |
| R5 | **M** | As a **resident**, I want to **track my order status in real time** (pending → accepted → in progress → completed), so that **I know when the provider will arrive**. |
| R6 | **M** | As a **resident**, I want to **pay electronically** via credit card or Apple Pay, so that **I avoid cash handling**. |
| R7 | **M** | As a **resident**, I want to **rate the service and write a review** after completion, so that **I help other residents make informed choices**. |
| R8 | **M** | As a **resident**, I want to **receive instant notifications** about my order status, so that **I stay updated without opening the app**. |
| R9 | **S** | As a **resident**, I want to **review my order history**, so that **I can re-order a previously used service**. |
| R10 | **S** | As a **resident**, I want to **cancel my order before it is accepted** by the provider, so that **I retain control over my requests**. |
| R11 | **S** | As a **resident**, I want to **chat with the service provider in-app**, so that **I can clarify order details**. |
| R12 | **C** | As a **resident**, I want to **subscribe to a monthly plan** for recurring services, so that **I save on cost**. |
| R13 | **C** | As a **resident**, I want to **receive smart provider recommendations** based on my history, so that **I find the best fit quickly**. |
| R14 | **W** | As a **resident**, I want to **use a QR code to verify the provider upon arrival** — deferred to a later phase. |

---

### 2.3 User Stories — Service Providers

| # | Priority | User Story |
|---|---|---|
| P1 | **M** | As a **service provider**, I want to **register and submit required documents** (commercial register/ID), so that **I get approval from the admin**. |
| P2 | **M** | As a **service provider**, I want to **create a catalog of my services with prices**, so that **residents can request them**. |
| P3 | **M** | As a **service provider**, I want to **receive new orders as instant notifications**, so that **I don't miss any opportunity**. |
| P4 | **M** | As a **service provider**, I want to **accept or reject orders** with a reason for rejection, so that **I manage my schedule efficiently**. |
| P5 | **M** | As a **service provider**, I want to **update order status** (in progress → completed), so that **the customer knows the service progress**. |
| P6 | **M** | As a **service provider**, I want to **view my daily and monthly earnings**, so that **I track my financial performance**. |
| P7 | **S** | As a **service provider**, I want to **edit my working hours and availability** (available/busy), so that **I control incoming orders**. |
| P8 | **S** | As a **service provider**, I want to **reply to customer reviews**, so that **I build good relationships with them**. |
| P9 | **C** | As a **service provider**, I want to **see an analytics dashboard with order and rating statistics**, so that **I improve my services**. |

---

### 2.4 User Stories — Admin

| # | Priority | User Story |
|---|---|---|
| A1 | **M** | As a **system admin**, I want to **review provider registration requests and approve or reject them**, so that **I ensure provider quality**. |
| A2 | **M** | As a **system admin**, I want to **manage service categories** (add/edit/delete), so that **the service list stays up-to-date**. |
| A3 | **M** | As a **system admin**, I want to **monitor all orders in the system**, so that **I detect any operational issues**. |
| A4 | **M** | As a **system admin**, I want to **receive complaints and disputes and resolve them**, so that **I maintain user trust**. |
| A5 | **M** | As a **system admin**, I want to **suspend any violating user account**, so that **I protect the platform from misuse**. |
| A6 | **S** | As a **system admin**, I want to **see an analytics dashboard with KPIs** (order count, revenue, active users), so that **I make data-driven decisions**. |
| A7 | **S** | As a **system admin**, I want to **export monthly reports in PDF/Excel**, so that **I share them with stakeholders**. |
| A8 | **C** | As a **system admin**, I want to **send bulk notifications to users**, so that **I inform them about new updates**. |

---

### 2.5 Mockups (Main Screens)

**6 essential screens** have been planned for the MVP. Detailed designs are available on Figma in the project folder. Planned screens:

#### 📱 Residents Mobile App (React Native)
1. **Splash + Login/Register** — phone number login with OTP
2. **Home Screen** — service categories + nearest providers on the map
3. **Service Details + Order** — service details and order creation screen
4. **Order Tracking** — real-time order tracking with status updates

#### 💻 Providers Web Portal (React Web)
5. **Provider Dashboard** — incoming orders, services management, earnings

#### 🛠️ Admin Dashboard (React Web)
6. **Admin Dashboard** — provider approvals, statistics, dispute management

> 📎 **Note:** Interactive Figma mockup files are available separately, and static screenshots are included in `/diagrams/mockups/`.

---

## 3. System Architecture

### 3.1 High-Level Architecture Diagram

The system follows a **three-tier Client-Server architecture** with a unified Backend serving all three clients:

![System Architecture](./diagrams/01_system_architecture.svg)

### 3.2 Component Explanation

#### Presentation Layer
- **Mobile App (React Native):** iOS/Android app for residents
- **Providers Portal (React ):** web interface for service providers
- **Admin Dashboard (React ):** admin control panel

#### API Gateway Layer
- **Nginx** as Reverse Proxy and Load Balancer
- Unified entry point + SSL termination + Rate limiting

#### Application Layer
- **Django REST Framework:** handles HTTP requests and business logic
- **JWT Authentication:** token-based authentication
- **Celery + Redis:** background task processing (notifications, reports, image processing)
- **Django Channels:** WebSocket support for real-time updates (order tracking)

#### Data Layer
- **MySQL:** primary relational database
- **Redis:** caching + task queue
- **AWS S3:** storage for images and documents

#### External Services
- **Google Maps API:** maps and routing
- **Moyasar / HyperPay:** Saudi payment gateway
- **Firebase Cloud Messaging:** Push notifications
- **Twilio / Unifonic:** OTP delivery via SMS

### 3.3 Primary Data Flow

```
User (App/Web)
    → Nginx (SSL + Load Balancer)
    → Django API (Authentication + Business Logic)
    → MySQL (Persist Data)
    → Redis Cache (Fast Retrieval)
    → Response back to User

Background Tasks:
Django → Celery Queue (Redis) → Worker → External APIs (FCM/SMS/Payment)
```

---

## 4. Components, Classes, and Database Design

### 4.1 Backend Components (Django Apps)

The system is divided into **7 Django Apps** to ensure clear separation of concerns:

| App | Responsibility |
|---|---|
| `accounts` | User management (three types) + authentication |
| `providers` | Provider profiles + approval + services |
| `services` | Service categories + offered services |
| `orders` | Orders + lifecycle + status management |
| `payments` | Financial transactions + payment gateway |
| `reviews` | Ratings and reviews |
| `notifications` | Notifications (Push + SMS + In-App) |

### 4.2 Frontend Components (React)

#### Providers Portal & Admin Dashboard (React)
```
src/
├── components/          # Shared components
│   ├── common/         # Button, Input, Modal, Card
│   ├── layout/         # Navbar, Sidebar, Footer
│   └── forms/          # FormInput, FormSelect
├── pages/              # Main pages
│   ├── auth/          # Login, Register
│   ├── dashboard/     # Main Dashboard
│   ├── services/      # Service management
│   ├── orders/        # Order management
│   └── analytics/     # Statistics
├── services/           # API calls (axios)
├── store/              # Redux state management
├── hooks/              # Custom React Hooks
└── utils/              # Helpers, Validators, Formatters
```

#### Mobile App (React Native)
```
src/
├── screens/            # Screens
│   ├── Auth/          # Login, Register, OTP
│   ├── Home/          # Home, Categories, Map
│   ├── Orders/        # CreateOrder, TrackOrder, OrderHistory
│   └── Profile/       # Profile, Settings
├── components/         # Reusable components
├── navigation/         # React Navigation stack
├── services/           # API layer
├── store/              # Redux + Redux Persist
└── utils/
```

### 4.3 Key Backend Classes (UML)

![Class Diagram](./diagrams/02_class_diagram.svg)

### 4.4 Entity-Relationship Diagram (ERD)

![ERD](./diagrams/03_erd.svg)

### 4.5 Database Schema (MySQL)

#### `users` table
```sql
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    phone           VARCHAR(15) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    user_type       VARCHAR(20) NOT NULL CHECK (user_type IN ('resident','provider','admin')),
    is_active       BOOLEAN DEFAULT TRUE,
    is_verified     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_type ON users(user_type);
```

#### `neighborhoods` table
```sql
CREATE TABLE neighborhoods (
    id              BIGSERIAL PRIMARY KEY,
    name_ar         VARCHAR(100) NOT NULL,
    name_en         VARCHAR(100),
    city            VARCHAR(100) NOT NULL,
    center_lat      DECIMAL(10,7) NOT NULL,
    center_lng      DECIMAL(10,7) NOT NULL,
    radius_km       DECIMAL(5,2) DEFAULT 3.0,
    is_active       BOOLEAN DEFAULT TRUE
);
```

#### `resident_profiles` table
```sql
CREATE TABLE resident_profiles (
    user_id         BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    neighborhood_id BIGINT REFERENCES neighborhoods(id),
    default_address TEXT,
    default_lat     DECIMAL(10,7),
    default_lng     DECIMAL(10,7)
);
```

#### `provider_profiles` table
```sql
CREATE TABLE provider_profiles (
    user_id             BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    business_name       VARCHAR(150) NOT NULL,
    commercial_register VARCHAR(50),
    id_document_url     VARCHAR(500),
    logo_url            VARCHAR(500),
    description         TEXT,
    neighborhood_id     BIGINT REFERENCES neighborhoods(id),
    location_lat        DECIMAL(10,7),
    location_lng        DECIMAL(10,7),
    status              VARCHAR(20) DEFAULT 'pending'
                        CHECK (status IN ('pending','approved','rejected','suspended')),
    rejection_reason    TEXT,
    is_available        BOOLEAN DEFAULT TRUE,
    avg_rating          DECIMAL(3,2) DEFAULT 0.0,
    total_reviews       INT DEFAULT 0,
    approved_at         TIMESTAMP,
    created_at          TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_providers_status ON provider_profiles(status);
CREATE INDEX idx_providers_neighborhood ON provider_profiles(neighborhood_id);
```

#### `service_categories` table
```sql
CREATE TABLE service_categories (
    id          BIGSERIAL PRIMARY KEY,
    name_ar     VARCHAR(100) NOT NULL,
    name_en     VARCHAR(100),
    icon_url    VARCHAR(500),
    is_active   BOOLEAN DEFAULT TRUE
);
-- Initial categories: Maintenance, Cleaning, Groceries, Restaurants, Laundry, Delivery
```

#### `services` table
```sql
CREATE TABLE services (
    id              BIGSERIAL PRIMARY KEY,
    provider_id     BIGINT NOT NULL REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
    category_id     BIGINT NOT NULL REFERENCES service_categories(id),
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    price           DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    price_type      VARCHAR(20) DEFAULT 'fixed' CHECK (price_type IN ('fixed','hourly','per_unit')),
    estimated_time  INT, -- in minutes
    is_available    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_category ON services(category_id);
```

#### `orders` table
```sql
CREATE TABLE orders (
    id                  BIGSERIAL PRIMARY KEY,
    order_number        VARCHAR(20) UNIQUE NOT NULL,
    resident_id         BIGINT NOT NULL REFERENCES users(id),
    provider_id         BIGINT NOT NULL REFERENCES users(id),
    service_id          BIGINT NOT NULL REFERENCES services(id),
    status              VARCHAR(20) DEFAULT 'pending'
                        CHECK (status IN ('pending','accepted','in_progress','completed','cancelled','rejected')),
    delivery_address    TEXT NOT NULL,
    delivery_lat        DECIMAL(10,7),
    delivery_lng        DECIMAL(10,7),
    notes               TEXT,
    scheduled_time      TIMESTAMP,
    price               DECIMAL(10,2) NOT NULL,
    payment_status      VARCHAR(20) DEFAULT 'unpaid'
                        CHECK (payment_status IN ('unpaid','paid','refunded')),
    cancellation_reason TEXT,
    accepted_at         TIMESTAMP,
    started_at          TIMESTAMP,
    completed_at        TIMESTAMP,
    cancelled_at        TIMESTAMP,
    created_at          TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_orders_resident ON orders(resident_id);
CREATE INDEX idx_orders_provider ON orders(provider_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

#### `payments` table
```sql
CREATE TABLE payments (
    id                     BIGSERIAL PRIMARY KEY,
    order_id               BIGINT NOT NULL REFERENCES orders(id),
    amount                 DECIMAL(10,2) NOT NULL,
    payment_method         VARCHAR(30) NOT NULL,
    gateway_transaction_id VARCHAR(100),
    status                 VARCHAR(20) DEFAULT 'pending'
                           CHECK (status IN ('pending','success','failed','refunded')),
    paid_at                TIMESTAMP,
    created_at             TIMESTAMP DEFAULT NOW()
);
```

#### `reviews` table
```sql
CREATE TABLE reviews (
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT UNIQUE NOT NULL REFERENCES orders(id),
    resident_id     BIGINT NOT NULL REFERENCES users(id),
    provider_id     BIGINT NOT NULL REFERENCES users(id),
    rating          INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    provider_reply  TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_reviews_provider ON reviews(provider_id);
```

#### `notifications` table
```sql
CREATE TABLE notifications (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    body        TEXT,
    type        VARCHAR(30), -- order_update, payment, system
    related_id  BIGINT,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_notif_user_unread ON notifications(user_id, is_read);
```

#### `complaints` table
```sql
CREATE TABLE complaints (
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT REFERENCES orders(id),
    complainant_id  BIGINT NOT NULL REFERENCES users(id),
    against_id      BIGINT NOT NULL REFERENCES users(id),
    subject         VARCHAR(200),
    description     TEXT NOT NULL,
    status          VARCHAR(20) DEFAULT 'open'
                    CHECK (status IN ('open','in_review','resolved','closed')),
    admin_response  TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    resolved_at     TIMESTAMP
);
```

---

## 5. Sequence Diagrams

Sequence diagrams have been prepared for **3 critical scenarios**:

### 5.1 Provider Registration and Approval
![Provider Registration](./diagrams/04_sequence_provider_registration.svg)

**Steps:**
1. Provider fills the registration form and uploads documents
2. React Portal sends `POST /api/providers/register`
3. Django stores the data in PostgreSQL with `pending` status
4. A notification is created for the admin
5. Admin reviews and approves via `PATCH /api/admin/providers/{id}/approve`
6. Status is updated and a push notification is sent to the provider via FCM

### 5.2 Order Creation and Tracking
![Order Flow](./diagrams/05_sequence_order_flow.svg)

**Steps:**
1. Resident selects a service from the app and sets their location
2. React Native sends `POST /api/orders` with JWT
3. Django creates the order and invokes the payment gateway (Moyasar)
4. On successful payment, a notification is sent to the provider
5. Provider accepts via `PATCH /api/orders/{id}/accept`
6. Real-time updates are pushed via WebSocket to the resident
7. On completion, the resident is prompted to leave a review

### 5.3 Payment Processing
![Payment Processing](./diagrams/06_sequence_payment.svg)

**Steps:**
1. Client app requests a payment session creation
2. Django contacts Moyasar to create a token
3. Client enters card details in a secure window
4. Moyasar processes the payment and sends a webhook to Django
5. Django updates order and payment status and notifies both parties

---

## 6. API Specifications

### 6.1 External APIs (Third-Party Services)

| Service | Usage | Reason for Selection |
|---|---|---|
| **Google Maps Platform** | Maps, geolocation search, distance calculation | Most accurate in Saudi Arabia, excellent documentation, ready React Native SDK |
| **Moyasar** | Electronic payment gateway | Approved Saudi gateway, supports Mada, Apple Pay, and international cards |
| **Firebase Cloud Messaging (FCM)** | Push notifications | Free, reliable, supports iOS and Android |
| **Unifonic** | SMS (OTP) delivery | Fast and certified Saudi provider |
| **AWS S3** | Image and document storage | Scalable + CDN + low cost |

### 6.2 Internal API Design

- **Base URL:** `https://api.hayyak.sa/api/v1`
- **Protocol:** HTTPS (REST + JSON)
- **Authentication:** JWT (Bearer Token) in the `Authorization` header
- **Versioning:** URL Path (`/v1/`)
- **Standard Response Formats:**

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid phone number",
    "details": { "phone": ["Must be a valid Saudi number"] }
  }
}
```

### 6.3 Key Endpoints

#### 🔐 Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Log in |
| POST | `/auth/otp/send` | Send OTP |
| POST | `/auth/otp/verify` | Verify OTP |
| POST | `/auth/refresh` | Refresh JWT |
| POST | `/auth/logout` | Log out |

**Example — `POST /auth/register`**

```json
// Request
{
  "phone": "+966501234567",
  "password": "SecurePass123",
  "full_name": "Ahmed Mohammed",
  "user_type": "resident"
}

// Response 201
{
  "success": true,
  "data": {
    "user_id": 142,
    "phone": "+966501234567",
    "otp_sent": true
  },
  "message": "Verification code sent"
}
```

#### 👤 Users & Profiles

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/me` | Current user profile |
| PATCH | `/users/me` | Update profile |
| POST | `/users/me/location` | Update geolocation |

#### 🏪 Providers

| Method | Endpoint | Description |
|---|---|---|
| POST | `/providers/register` | Register as provider |
| GET | `/providers` | List providers (with filters) |
| GET | `/providers/{id}` | Provider details |
| PATCH | `/providers/me` | Update provider profile |
| PATCH | `/providers/me/availability` | Toggle availability |

**Example — `GET /providers?category=2&lat=24.71&lng=46.67&radius=3`**

```json
// Response 200
{
  "success": true,
  "data": {
    "results": [
      {
        "id": 15,
        "business_name": "Neighborhood Plumber",
        "avg_rating": 4.7,
        "total_reviews": 132,
        "distance_km": 0.8,
        "is_available": true,
        "services_count": 5
      }
    ],
    "count": 8,
    "next": null
  }
}
```

#### 🛠️ Services

| Method | Endpoint | Description |
|---|---|---|
| GET | `/categories` | List service categories |
| GET | `/services` | Search for services (with filters) |
| POST | `/services` | Add a service (provider only) |
| GET | `/services/{id}` | Service details |
| PATCH | `/services/{id}` | Edit service |
| DELETE | `/services/{id}` | Delete service |

#### 📦 Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders` | Create order |
| GET | `/orders` | Current user's orders |
| GET | `/orders/{id}` | Order details |
| PATCH | `/orders/{id}/accept` | Accept order (provider) |
| PATCH | `/orders/{id}/reject` | Reject order |
| PATCH | `/orders/{id}/start` | Start order execution |
| PATCH | `/orders/{id}/complete` | Complete order |
| PATCH | `/orders/{id}/cancel` | Cancel order (resident) |

**Example — `POST /orders`**

```json
// Request
{
  "service_id": 27,
  "delivery_address": "Al Nuzhah, Prince Sultan St., Building 12",
  "delivery_lat": 24.7136,
  "delivery_lng": 46.6753,
  "scheduled_time": "2026-04-25T16:00:00Z",
  "notes": "Apartment on the third floor"
}

// Response 201
{
  "success": true,
  "data": {
    "order_id": 5014,
    "order_number": "HYK-20260423-5014",
    "status": "pending",
    "price": 150.00,
    "payment_url": "https://moyasar.com/pay/xyz..."
  }
}
```

#### 💳 Payments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/payments/initiate/{order_id}` | Initiate payment |
| POST | `/payments/webhook/moyasar` | Webhook from Moyasar |
| GET | `/payments/{id}` | Transaction details |

#### ⭐ Reviews

| Method | Endpoint | Description |
|---|---|---|
| POST | `/reviews` | Add review |
| GET | `/providers/{id}/reviews` | Provider reviews |
| POST | `/reviews/{id}/reply` | Provider reply |

#### 🛡️ Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/providers/pending` | Providers pending approval |
| PATCH | `/admin/providers/{id}/approve` | Approve provider |
| PATCH | `/admin/providers/{id}/reject` | Reject provider |
| PATCH | `/admin/users/{id}/suspend` | Suspend user account |
| GET | `/admin/complaints` | Complaints list |
| PATCH | `/admin/complaints/{id}/resolve` | Resolve complaint |
| GET | `/admin/analytics/dashboard` | KPI dashboard |

---

## 7. SCM and QA Strategies

### 7.1 Source Control Management (SCM)

#### Tool: **Git + GitHub**

#### Branching Strategy — **Modified GitHub Flow**

```
main                    ← Production
 ├── develop             ← Integration
 │    ├── feature/ORD-12-create-order
 │    ├── feature/AUTH-5-otp-verification
 │    ├── bugfix/PAY-8-duplicate-payment
 │    └── hotfix/SEC-3-jwt-expiry
 └── release/v1.0.0      ← Specific release
```

| Type | Usage | Example |
|---|---|---|
| `main` | Code deployed to production | — |
| `develop` | Latest code in development | — |
| `feature/*` | New feature | `feature/ORD-12-create-order` |
| `bugfix/*` | Non-critical bug fix | `bugfix/PAY-8-duplicate-payment` |
| `hotfix/*` | Urgent production fix | `hotfix/SEC-3-jwt-expiry` |
| `release/*` | Release preparation | `release/v1.0.0` |

#### Commit Message Rules — **Conventional Commits**
```
<type>(<scope>): <subject>

feat(orders): add order cancellation endpoint
fix(auth): resolve JWT refresh token rotation bug
docs(api): update endpoint specifications
refactor(db): normalize user address tables
test(payments): add integration tests for Moyasar webhook
```

#### Pull Request Policy
- **Mandatory review** by at least one developer before merging
- **CI must pass** (tests + Lint) as a merge condition
- **Minimum 80% test coverage** for new code
- Use a unified **PR Template** (description, tests, screenshots, breaking changes)
- **Squash merge** to keep a clean history on `main`

#### Task Management
- **Jira / GitHub Projects** for task tracking
- Link every Branch/PR to the task number
- Use **two-week Sprints**

### 7.2 Quality Assurance (QA)

#### Testing Pyramid

```
         /\
        /E2E\        ← 10% — Cypress (Critical flows)
       /------\
      /Integr. \     ← 20% — DRF APITestCase
     /----------\
    /   Unit     \   ← 70% — Pytest / Jest
   /--------------\
```

#### Backend Testing (Django)

| Type | Tool | Coverage |
|---|---|---|
| **Unit Tests** | `pytest`, `pytest-django` | Models, Services, Utils |
| **Integration Tests** | `DRF APITestCase` | Endpoints + DB |
| **Mocking** | `unittest.mock`, `responses` | External APIs |
| **Coverage** | `coverage.py` | Target: ≥ 80% |
| **Static Analysis** | `flake8`, `black`, `mypy` | — |
| **Security** | `bandit`, `safety` | — |

#### Frontend Testing (React / React Native)

| Type | Tool | Coverage |
|---|---|---|
| **Unit / Component** | `Jest` + `React Testing Library` | Components, Hooks, Reducers |
| **E2E (Web)** | `Cypress` | Key user journeys |
| **E2E (Mobile)** | `Detox` | Critical app scenarios |
| **Linting** | `ESLint`, `Prettier` | — |
| **Type Safety** | `TypeScript` (optional) | — |

#### API Testing
- **Postman Collections** organized per endpoint
- **Newman** for automated CI execution
- **OpenAPI/Swagger** for documentation and live testing

#### CI/CD Pipeline — **GitHub Actions**

```yaml
# .github/workflows/ci.yml — simplified example
on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup-python (3.11)
      - install dependencies
      - run flake8 + black --check
      - run pytest with coverage
      - upload coverage report

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup-node (20)
      - npm ci
      - npm run lint
      - npm test -- --coverage
      - npm run build

  deploy:
    needs: [backend-tests, frontend-tests]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - deploy to production
```

#### Deployment Environments

| Environment | Purpose | Deployment |
|---|---|---|
| **Development** | Local developer environment | Manual (docker-compose) |
| **Staging** | Pre-release testing | Automated from `develop` |
| **Production** | Live | Automated from `main` after review |

#### Manual Testing (User Acceptance Testing)
- **Exploratory testing** for every new feature before merging to `main`
- **UAT sessions** with a real user sample before launch
- **Beta Testing** via TestFlight (iOS) and Google Play Beta (Android)

---

## 8. Technical Justifications

Every technical decision is justified based on project requirements:

### 8.1 Choosing Django REST Framework (over FastAPI)

| Criterion | Django + DRF | FastAPI | Winner |
|---|---|---|---|
| **Built-in Admin Panel** | ✅ Very powerful | ❌ Must be built | Django |
| **Mature ORM** | ✅ Django ORM | ⚠️ SQLAlchemy (separate) | Django |
| **Built-in Authentication** | ✅ | ⚠️ Manual | Django |
| **Community & Documentation** | ✅ Much larger | ⚠️ Good but smaller | Django |
| **Async Performance** | ⚠️ Acceptable | ✅ Excellent | FastAPI |
| **Development Speed** | ✅ Fast for MVP | ⚠️ Requires boilerplate | Django |

**Decision:** Django + DRF, because the project needs a strong admin panel, built-in security features (authentication, permissions), and a reliable ORM. Expected performance is sufficient for the MVP.

### 8.2 Choosing PostgreSQL (over MongoDB)

- **Strong relationships:** Orders are tied to users, services, providers, and payments — relational integrity enforces consistency.
- **Financial transactions:** PostgreSQL fully supports ACID transactions, essential for payments.
- **Geospatial queries:** PostGIS extension provides excellent performance for location-based searches.
- **Django integration:** Django ORM is more optimized for SQL.
- **High reliability** for sensitive data.

### 8.3 Choosing React Native (over Flutter or Native)

- **Shared knowledge:** The team uses React for the web — no need to learn Dart.
- **Code Reuse:** Logic (API services, validators) can be shared between web and mobile.
- **Mature ecosystem:** Ready libraries for almost everything.
- **Hot Reload** accelerates development.
- **Expo** simplifies build and deploy for the MVP.

### 8.4 Choosing React (over Next.js for Portals)

The providers portal and admin dashboard are **internal authenticated applications (SPA)** that don't require SEO or SSR, so React + Vite is simpler and faster than Next.js.

### 8.5 JWT (over Session-based)

- **Stateless:** No need to store sessions on the server → easier to scale.
- **Suitable for multi-client:** Mobile app + web + external services.
- **High performance:** No DB query to verify each request.

### 8.6 Redis (for Caching + Queue)

- **Speeds up repeated queries:** (provider lists, service categories).
- **Celery queue** for sending notifications without blocking the API.
- **Effective rate limiting** management.

### 8.7 Moyasar (over Stripe or PayTabs)

- **Certified Saudi gateway** by the Central Bank.
- **Supports Mada** (local card) along with international cards and Apple Pay.
- **Reasonable fees** for the Saudi market.
- **Arabic documentation** and local technical support.

### 8.8 WebSockets via Django Channels

For real-time order tracking without constant HTTP polling → saves resources + better user experience.

### 8.9 AWS S3 (for Storage)

- **Reliable and scalable** for storing service images, provider logos, official documents.
- **CloudFront CDN** for performance.
- **Low cost** compared to storing files on the server.

### 8.10 GitHub Actions (over Jenkins)

- **Integrated with GitHub** without separate infrastructure setup.
- **Free** for small and medium projects.
- **Easy to maintain** (YAML files).

---

## 📎 Appendices

### Attached Diagrams

All diagrams are in the `/diagrams/` folder:

| File | Description |
|---|---|
| `01_system_architecture.svg` | Overall system architecture |
| `02_class_diagram.svg` | Backend Class Diagram |
| `03_erd.svg` | Database schema (ERD) |
| `04_sequence_provider_registration.svg` | Provider registration sequence |
| `05_sequence_order_flow.svg` | Order creation and tracking sequence |
| `06_sequence_payment.svg` | Electronic payment sequence |

### References

- [Django REST Framework Docs](https://www.django-rest-framework.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Native Docs](https://reactnative.dev/)
- [Moyasar API Docs](https://docs.moyasar.com/)
- [Google Maps Platform](https://developers.google.com/maps)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Prepared by:** Hayyak Team — April 2026
**Version:** 1.0
