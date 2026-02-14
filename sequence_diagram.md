```mermaid

sequenceDiagram
    participant Requester as Client (Staff/User)
    participant APIGateway as API Gateway
    participant Auth as AuthService
    participant Order as OrderService
    participant Inventory as InventoryService
    participant DB as Database

    %% Authentication Flow
    Requester->>APIGateway: POST /orders (Token, OrderDetails)
    APIGateway->>Auth: Verify Token
    Auth-->>APIGateway: Token Valid (Role: STAFF)

    %% Order Processing Flow
    APIGateway->>Order: Create Order(OrderDetails)
    Order->>Inventory: Check Stock Availability(ProductIds)
    Inventory->>DB: Query Stock & Version
    DB-->>Inventory: Stock OK, Version=V1
    Inventory-->>Order: Stock Available

    %% Atomic Transaction Block
    Note over Order, DB: Database Transaction Scope Start
    Order->>Inventory: Reserve Stock (Atomic Update)
    Inventory->>DB: UPDATE Products SET stock = stock - qty, version = V2 WHERE id = P1 AND version = V1
    DB-->>Inventory: Rows Affected: 1 (Success)
    Inventory-->>Order: Reservation Confirmed

    Order->>DB: INSERT INTO Orders (Status: PENDING)
    DB-->>Order: Order Created
    Note over Order, DB: Database Transaction Scope End

    Order-->>APIGateway: Order Created Successfully
    APIGateway-->>Requester: 201 Created (Order ID)

    %% Flow Summary
    %% 1. **Secure Entry**: The request first hits the `API Gateway`, which delegates token verification to `AuthService`.
    %% 2. **Service Orchestration**: `OrderService` acts as the orchestrator, coordinating with `InventoryService` before finalizing the order.
    %% 3. **Atomic Integrity**: `InventoryService` performs an atomic update using optimistic locking (`WHERE version = V1`). If the rows affected is 0, it means the data changed concurrently, and the transaction would roll back.
    %% 4. **Transactional Safety**: The stock deduction and order creation happen within a transaction scope to ensure data consistency.

    ```
