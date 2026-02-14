```mermaid
flowchart LR

    subgraph "Inventory & Order Management System"
        direction TB

        %% Use Cases
        UC1(Login / Authenticate)
        UC2(Manage Products)
        UC3(View Stock Reports)
        UC4(Place Order)
        UC5(Update Order Status)
        UC6(Track Order Lifecycle)
        UC7(Atomic Stock Check)

        %% Relationships
        UC4 -.-> UC7 : <<include>>
        UC5 -.-> UC6 : <<extend>>
    end

    %% Actors
    Admin((Admin))
    Staff((Staff))
    System((System Timer/Job))

    %% Connections
    Admin --> UC1
    Admin --> UC2
    Admin --> UC3

    Staff --> UC1
    Staff --> UC4
    Staff --> UC5
    Staff --> UC6

    System --> UC6 : Auto-expire pending

    %% Flow Summary
    %% 1. **Role-Based Access**: The diagram clearly distinguishes between `Admin` (Inventory Management) and `Staff` (Order Processing) roles.
    %% 2. **Authentication First**: Both actors must `Authenticate` (UC1) to access the system, ensuring secure access.
    %% 3. **Process Inclusion**: "Place Order" (UC4) *includes* "Atomic Stock Check" (UC7), highlighting that stock verification is an integral, mandatory part of the ordering process.
    %% 4. **Lifecycle Extension**: "Update Order Status" (UC5) extends "Track Order Lifecycle" (UC6), showing that status updates drive the lifecycle management of an order.
```
