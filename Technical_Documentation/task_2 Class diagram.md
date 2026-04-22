# 🏙️ Hayyek Platform – Task 2: Class Diagram

## 📌 Overview

This document represents the **Class Diagram** for the Hayyek platform.

The goal is to define:
- Main system entities (classes)
- Attributes of each class
- Relationships between classes
- System structure from an object-oriented perspective

---

# 🧱 Main Classes in the System

The system is built around the following core entities:

- User (Base Class)
- Resident
- ServiceProvider
- Admin
- Service
- ServiceCategory
- Order
- Payment
- Review
- Location
- Notification

---

# 🧬 Class Diagram

```mermaid
classDiagram

%% =========================
%% BASE USER CLASS
%% =========================
class User {
  +int id
  +string name
  +string email
  +string password
  +string phone
  +string role
  +login()
  +logout()
}

%% =========================
%% INHERITANCE
%% =========================
class Resident {
  +requestService()
  +makePayment()
  +leaveReview()
}

class ServiceProvider {
  +string businessName
  +string serviceType
  +float rating
  +acceptOrder()
  +rejectOrder()
  +updateStatus()
}

class Admin {
  +manageUsers()
  +manageServices()
  +viewReports()
}

User <|-- Resident
User <|-- ServiceProvider
User <|-- Admin

%% =========================
%% SERVICE & CATEGORY
%% =========================
class Service {
  +int serviceId
  +string title
  +string description
  +float price
}

class ServiceCategory {
  +int categoryId
  +string name
}

Service --> ServiceCategory : belongs_to
ServiceProvider --> Service : provides

%% =========================
%% ORDER
%% =========================
class Order {
  +int orderId
  +string status
  +datetime createdAt
  +float totalPrice
  +createOrder()
  +updateStatus()
  +cancelOrder()
}

Resident --> Order : creates
ServiceProvider --> Order : handles
Order --> Service : includes

%% =========================
%% PAYMENT
%% =========================
class Payment {
  +int paymentId
  +float amount
  +string method
  +string status
  +processPayment()
}

Order --> Payment : has

%% =========================
%% REVIEW
%% =========================
class Review {
  +int reviewId
  +int rating
  +string comment
  +datetime createdAt
}

Resident --> Review : writes
ServiceProvider --> Review : receives
Review --> Order : related_to

%% =========================
%% LOCATION
%% =========================
class Location {
  +float latitude
  +float longitude
  +string address
}

User --> Location : has
Order --> Location : service_location

%% =========================
%% NOTIFICATION
%% =========================
class Notification {
  +int notificationId
  +string message
  +string status
  +sendNotification()
}

User --> Notification : receives
Order --> Notification : triggers
```

---

# 🔗 Explanation of Relationships

## 🔹 Inheritance
- `Resident`, `ServiceProvider`, and `Admin` inherit from `User`
- This ensures shared attributes like:
  - name
  - email
  - password

---

## 🔹 Service Relationships
- A **Service** belongs to a **ServiceCategory**
- A **ServiceProvider** can provide multiple services

---

## 🔹 Order Relationships
- A **Resident** creates an order
- A **ServiceProvider** handles the order
- Each **Order** is linked to a specific **Service**

---

## 🔹 Payment Relationships
- Each **Order** has one **Payment**
- Payment contains transaction details

---

## 🔹 Review Relationships
- A **Resident** writes a review
- A **ServiceProvider** receives it
- Each review is linked to an **Order**

---

## 🔹 Location Relationships
- Each **User** has a location
- Each **Order** has a service location

---

## 🔹 Notification Relationships
- Notifications are sent to users
- Orders trigger notifications

---

# 🧠 Design Considerations

- Separation of concerns between entities
- Use of inheritance to avoid duplication
- Clear mapping between real-world and system objects
- Scalable structure for future features

---

# ✅ Summary

This Class Diagram defines the core structure of the Hayyek system and ensures:

- Clear entity relationships
- Logical data modeling
- Easy transition to database design
- Strong foundation for backend implementation

---
