# 🏙️ Hayyek Platform – ER Diagram

## 📌 Overview
This ER Diagram represents the main database entities of the **Hayyek** platform and the relationships between them.

The system includes:

- Residents
- Service Providers
- Admins
- Services
- Categories
- Orders
- Payments
- Reviews
- Locations
- Notifications

---

## 🗂️ ER Diagram

```mermaid
erDiagram

    USER {
        int id PK
        string name
        string email
        string password
        string phone
        string role
        datetime created_at
    }

    RESIDENT {
        int id PK
        int user_id FK
    }

    SERVICE_PROVIDER {
        int id PK
        int user_id FK
        string business_name
        string service_type
        float rating
        string status
    }

    ADMIN {
        int id PK
        int user_id FK
    }

    CATEGORY {
        int id PK
        string name
        string description
    }

    SERVICE {
        int id PK
        int category_id FK
        int provider_id FK
        string title
        string description
        float price
        string availability
    }

    LOCATION {
        int id PK
        int user_id FK
        float latitude
        float longitude
        string address
        string city
    }

    ORDER {
        int id PK
        int resident_id FK
        int provider_id FK
        int service_id FK
        int location_id FK
        string status
        string description
        float total_price
        datetime created_at
    }

    PAYMENT {
        int id PK
        int order_id FK
        float amount
        string method
        string status
        string transaction_id
        datetime paid_at
    }

    REVIEW {
        int id PK
        int order_id FK
        int resident_id FK
        int provider_id FK
        int rating
        string comment
        datetime created_at
    }

    NOTIFICATION {
        int id PK
        int user_id FK
        int order_id FK
        string message
        string status
        datetime created_at
    }

    USER ||--o| RESIDENT : has
    USER ||--o| SERVICE_PROVIDER : has
    USER ||--o| ADMIN : has
    USER ||--o{ LOCATION : has
    USER ||--o{ NOTIFICATION : receives

    CATEGORY ||--o{ SERVICE : contains
    SERVICE_PROVIDER ||--o{ SERVICE : provides

    RESIDENT ||--o{ ORDER : creates
    SERVICE_PROVIDER ||--o{ ORDER : handles
    SERVICE ||--o{ ORDER : requested_in
    LOCATION ||--o{ ORDER : used_for

    ORDER ||--o| PAYMENT : has
    ORDER ||--o| REVIEW : receives
    ORDER ||--o{ NOTIFICATION : triggers

    RESIDENT ||--o{ REVIEW : writes
    SERVICE_PROVIDER ||--o{ REVIEW : gets
```

---

## 🔗 Relationship Explanation

### User and Roles
- A **User** can be a:
  - Resident
  - Service Provider
  - Admin

Each one is stored in a separate entity linked to the main `USER` table.

### Category and Service
- One **Category** can contain many **Services**
- One **Service Provider** can provide many **Services**

### Orders
- One **Resident** can create many **Orders**
- One **Service Provider** can handle many **Orders**
- Each **Order** is linked to one **Service**
- Each **Order** uses one **Location**

### Payment
- Each **Order** has one **Payment**

### Review
- Each **Order** can have one **Review**
- A **Resident** writes the review
- A **Service Provider** receives the review

### Notifications
- A **User** can receive many **Notifications**
- Notifications may be linked to a specific **Order**

---

## ✅ Notes
This ER Diagram is suitable for:
- database design
- backend implementation
- API development
- software engineering documentation

It also matches the main features of the Hayyek platform:
- service requests
- provider matching
- payments
- ratings
- notifications
- location support
