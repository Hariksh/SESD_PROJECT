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
    UC4 -.->|&quot;&lt;&lt;include&gt;&gt;&quot;| UC7
    UC5 -.->|&quot;&lt;&lt;extend&gt;&gt;&quot;| UC6
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

System -->|Auto-expire pending| UC6

```

### Flow Summary

| Phase | Description | Key Relationships |
| :--- | :--- | :--- |
| **1. Role-Based Access** | Distinguishes `Admin` (Inventory) and `Staff` (Orders) capabilities. | **Actor Specialization**, **RBAC** |
| **2. Auth First** | All actors must `Authenticate` before accessing any system features. | **Precondition**, **Security Barrier** |
| **3. Process Inclusion** | `Place Order` mandates `Atomic Stock Check` via `<<include>>`. | **<<include>>** (Mandatory) |
| **4. Lifecycle Extension** | `Update Order Status` adds to `Track Order Lifecycle` functionality. | **<<extend>>** (Optional/Add-on) |
