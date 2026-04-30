# 🏙️ Hayyek Platform – Task 4: API Documentation

## 📌 Overview

This document describes both:

- **External APIs** used by the Hayyek platform
- **Internal REST API Endpoints** designed for the system

The goal is to clearly define how the system communicates internally and with third-party services.

---

# 🌐 External APIs

## 1. Google Maps API

### 📌 Purpose:
Used for:
- Location selection
- Address validation
- Finding nearby service providers
- Distance calculation

### 🎯 Why chosen:
- Highly accurate and reliable
- Global coverage
- Easy integration with frontend apps

---

## 2. Payment Gateway API (Stripe / PayTabs / STC Pay)

### 📌 Purpose:
Used for:
- Processing online payments
- Verifying transactions
- Handling secure checkout

### 🎯 Why chosen:
- Secure and trusted
- Supports multiple payment methods
- Easy backend integration

---

## 3. Firebase Cloud Messaging (FCM)

### 📌 Purpose:
Used for:
- Sending push notifications
- Real-time alerts (new orders, updates, payments)

### 🎯 Why chosen:
- Fast and scalable
- Works on mobile and web
- Easy integration with apps

---

## 4. Cloud Storage API (Cloudinary / AWS S3)

### 📌 Purpose:
Used for:
- Uploading images (profile, services)
- Storing documents

### 🎯 Why chosen:
- Scalable storage
- Secure file handling
- Fast content delivery

---

# 🔌 Internal API Design (REST API)

## 📌 Base URL

```
https://api.hayyek.com/api/v1
```

---

# 🔐 Authentication Endpoints

## 1. Register User

- **URL:** `/auth/register`
- **Method:** POST

### Input (JSON):
```json
{
  "name": "Ali",
  "email": "ali@email.com",
  "password": "123456",
  "phone": "0500000000",
  "role": "resident"
}
```

### Output:
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

---

## 2. Login

- **URL:** `/auth/login`
- **Method:** POST

### Input:
```json
{
  "email": "ali@email.com",
  "password": "123456"
}
```

### Output:
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "Ali"
  }
}
```

---

# 🧑 User Endpoints

## 3. Get User Profile

- **URL:** `/users/profile`
- **Method:** GET

### Output:
```json
{
  "id": 1,
  "name": "Ali",
  "email": "ali@email.com",
  "phone": "0500000000"
}
```

---

# 🛠️ Services Endpoints

## 4. Get All Services

- **URL:** `/services`
- **Method:** GET

### Output:
```json
[
  {
    "id": 1,
    "name": "Plumbing",
    "price": 100
  }
]
```

---

## 5. Get Services by Category

- **URL:** `/services?category=cleaning`
- **Method:** GET

---

# 📦 Orders Endpoints

## 6. Create Order

- **URL:** `/orders`
- **Method:** POST

### Input:
```json
{
  "serviceId": 1,
  "location": "Makkah",
  "description": "Fix water leak"
}
```

### Output:
```json
{
  "orderId": 101,
  "status": "Pending"
}
```

---

## 7. Get User Orders

- **URL:** `/orders`
- **Method:** GET

---

## 8. Update Order Status

- **URL:** `/orders/{id}/status`
- **Method:** PUT

### Input:
```json
{
  "status": "In Progress"
}
```

---

# 💳 Payment Endpoints

## 9. Process Payment

- **URL:** `/payments`
- **Method:** POST

### Input:
```json
{
  "orderId": 101,
  "amount": 100,
  "method": "card"
}
```

### Output:
```json
{
  "status": "Success",
  "transactionId": "TX12345"
}
```

---

# ⭐ Review Endpoints

## 10. Submit Review

- **URL:** `/reviews`
- **Method:** POST

### Input:
```json
{
  "orderId": 101,
  "rating": 5,
  "comment": "Excellent service"
}
```

---

# 🔔 Notification Endpoints

## 11. Get Notifications

- **URL:** `/notifications`
- **Method:** GET

---

# 📌 Notes on API Design

- All APIs follow **RESTful principles**
- Data format is **JSON**
- Authentication uses **JWT tokens**
- Proper HTTP methods are used:
  - GET → retrieve data
  - POST → create data
  - PUT → update data
- API versioning is included (`/v1`)

---

# ✅ Summary

This API design ensures:

- Clear communication between frontend and backend
- Secure user authentication
- Scalable and maintainable system
- Integration with external services
- Well-structured endpoints for all system operations

---

# 📌 Conclusion

The Hayyek API is designed to support all system features including:

- user management
- service browsing
- order processing
- payment handling
- notifications
- reviews

This makes the platform ready for real-world implementation.
