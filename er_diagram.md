```mermaid
erDiagram

    USERS {
        string _id PK
        string name
        string email
        string password_hash
        string role "ADMIN | STAFF"
        datetime created_at
    }

    CATEGORIES {
        string _id PK
        string name
        string description
    }

    PRODUCTS {
        string _id PK
        string name
        string description
        float price
        int stock
        int low_stock_threshold
        int version "Optimistic Lock"
        string category_id FK
        datetime updated_at
    }

    CATEGORIES ||--o{ PRODUCTS : categorizes

    ORDERS {
        string _id PK
        string user_id FK
        float total_amount
        string status "PENDING | CONFIRMED | SHIPPED | ..."
        datetime created_at
        datetime updated_at
    }

    ORDER_ITEMS {
        string _id PK
        string order_id FK
        string product_id FK
        int quantity
        float unit_price
    }

    STOCK_LOGS {
        string _id PK
        string product_id FK
        string order_id FK
        int quantity_changed
        string change_type "DEDUCT | RESTOCK"
        datetime timestamp
    }

    USERS ||--o{ ORDERS : places
    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : "included in"
    PRODUCTS ||--o{ STOCK_LOGS : "has history"

```

### Flow Summary

| Phase | Description | Key Concepts |
| :--- | :--- | :--- |
| **1. Data Integrity** | `USERS` table stores `password_hash` instead of plain text. | **Hashing**, **Security Best Practices** |
| **2. Concurrency Control** | `PRODUCTS.version` enables optimistic locking for atomic updates. | **Optimistic Locking**, **Versioning** |
| **3. Order Lifecycle** | `ORDERS.status` tracks the progression of an order. | **State Persistence**, **Enum Mapping** |
| **4. Audit Trail** | `STOCK_LOGS` records every stock change for accountability. | **Audit Logging**, **Event Sourcing (Lite)** |
