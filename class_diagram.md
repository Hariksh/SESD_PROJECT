```mermaid
classDiagram

class User {
    +string id
    +string name
    +string email
    +string passwordHash
    +Role role
    +login()
    +verifyToken()
}

class Role {
    <<enumeration>>
    ADMIN
    STAFF
}

class Product {
    +string id
    +string name
    +float price
    +int stock
    +int lowStockThreshold
    +int version
    +isAvailable(int qty)
}

class Category {
    +string id
    +string name
    +string description
}

Product "*" -- "1" Category

class Order {
    +string id
    +string userId
    +float totalAmount
    +OrderStatus status
    +DateTime createdAt
    +addLocation()
}

class OrderStatus {
    <<enumeration>>
    PENDING
    CONFIRMED
    SHIPPED
    DELIVERED
    CANCELLED
}

class OrderItem {
    +string productId
    +int quantity
    +float price
}

class AuthService {
    +authenticate(email, password)
    +authorize(token, role)
}

class InventoryService {
    +checkStock(productId, qty)
    +updateStockAtomic(productId, qty, version)
}

class OrderService {
    +createOrder(userId, items)
    +updateOrderStatus(orderId, status)
    +getOrderHistory(orderId)
}

User "1" -- "1" Role
Order "1" -- "1" OrderStatus
Order "1" *-- "*" OrderItem
OrderItem "*" -- "1" Product
OrderService ..> InventoryService : uses
OrderService ..> AuthService : secures
InventoryService ..> Product : manages
OrderService ..> Order : manages

```

### Flow Summary

| Phase | Description | Key Patterns |
| :--- | :--- | :--- |
| **1. Modular Architecture** | Services (`AuthService`, `InventoryService`, `OrderService`) are decoupled. | **Service Layer Pattern**, **Separation of Concerns** |
| **2. Secure Authentication** | `AuthService` validates tokens; restricts access to `User` roles. | **RBAC**, **Token-Based Auth** |
| **3. Atomic Stock Updates** | `InventoryService` ensures thread-safe stock deduction using `version`. | **Optimistic Locking**, **Atomic Operations** |
| **4. Lifecycle Management** | `Order` state managed via `OrderStatus` (PENDING → DELIVERED). | **State Machine**, **Enum Strategy** |
