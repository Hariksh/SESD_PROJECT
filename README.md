# Inventory & Order Management System

A full-stack, role-based Inventory and Order Management System built with Node.js / Express (backend) and React / Vite (frontend), backed by MongoDB.

---

## Features

### Role-Based Access Control (RBAC)
- **Admin** — Full CRUD on products, categories, and users. Views all orders and analytics reports.
- **Staff** — Places orders, updates order status, and views stock availability.
- All endpoints protected via **JWT authentication**.

### Real-Time Inventory Management
- **Atomic Stock Updates** — Prevents overselling using **Optimistic Locking** (version field). Concurrent updates are detected and rejected with a 409 Conflict.
- **Low-Stock Alerts** — Console warning triggered automatically when stock drops below `lowStockThreshold`.
- **Audit Trail** — Every stock change (restock or deduction) is logged in `STOCK_LOGS` for full accountability.

### Lifecycle-Based Order Processing
- **State Machine** — Orders follow a strict lifecycle:
  ```
  PENDING → CONFIRMED → SHIPPED → DELIVERED
                 ↘ CANCELLED (from PENDING or CONFIRMED)
  ```
- **Invalid transitions are rejected** — e.g., a SHIPPED order cannot go back to PENDING.
- **Stock is automatically restocked** if an order is CANCELLED.

### Background Jobs
- **Auto-expire cron job** — Runs every 15 minutes and automatically cancels orders that have been PENDING for more than 24 hours.

### Analytics Dashboard
- Total products, stock levels, low-stock counts, out-of-stock counts.
- Category distribution of products.
- Revenue trends for the last 7 days.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Background Jobs | node-cron |
| Frontend | React, Vite, TailwindCSS |

---

## Project Structure

```
SESD/
├── backend/
│   └── src/
│       ├── config/          # DB connection
│       ├── core/            # BaseService & BaseController (OOP abstractions)
│       ├── models/          # Mongoose schemas
│       │   ├── user.model.js
│       │   ├── product.model.js
│       │   ├── category.model.js
│       │   ├── order.model.js
│       │   └── stockLog.model.js
│       ├── services/        # Business logic layer
│       │   ├── auth.service.js
│       │   ├── inventory.service.js
│       │   ├── order.service.js
│       │   ├── user.service.js
│       │   ├── category.service.js
│       │   └── analytics.service.js
│       ├── controllers/     # HTTP request handlers
│       ├── routes/          # Express route definitions
│       ├── middleware/      # JWT protect + RBAC authorize
│       ├── jobs/            # Cron jobs (auto-expire orders)
│       └── server.js        # App entry point
│
├── frontend/
│   └── src/
│       ├── pages/           # Login, Dashboard, Orders
│       ├── components/      # Navbar
│       ├── context/         # Auth context
│       └── App.jsx
│
├── idea.md                  # Project mission & feature spec
├── er_diagram.md            # Entity-Relationship diagram
├── class_diagram.md         # OOP class diagram
├── usecase_diagram.md       # Use-case diagram
└── sequence_diagram.md      # Sequence diagram (order flow)
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/Hariksh/SESD_PROJECT.git
cd SESD_PROJECT
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
NODE_ENV=development
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`  
Backend runs at: `http://localhost:5001`

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |

### Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | All | Get all products |
| GET | `/api/products/:id` | All | Get product by ID |
| GET | `/api/products/:id/logs` | All | Get stock audit logs |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| PATCH | `/api/products/:id/stock` | Admin, Staff | Atomic stock update |

### Categories
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/categories` | All | Get all categories |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Delete category |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | Admin, Staff | Place a new order |
| GET | `/api/orders` | Admin, Staff | Get orders (Admin: all; Staff: own) |
| GET | `/api/orders/:id` | Admin, Staff | Get order by ID |
| PATCH | `/api/orders/:id/status` | Admin, Staff | Update order status |

### Users (Admin Only)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/:id` | Admin | Get user by ID |
| PATCH | `/api/users/:id/role` | Admin | Change user role |
| DELETE | `/api/users/:id` | Admin | Delete a user |

### Analytics
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/analytics/dashboard` | Admin | Dashboard stats + revenue trends |

---

## OOP Design Principles

This project follows Object-Oriented Programming principles throughout:

- **Abstraction** — `BaseService` and `BaseController` define common CRUD operations. All services/controllers extend them.
- **Encapsulation** — Business logic is encapsulated inside service classes; routes only call controllers.
- **Inheritance** — `AuthService`, `InventoryService`, `OrderService`, `UserService` all extend `BaseService`.
- **Polymorphism** — Each service overrides base methods (e.g., `getAll()`, `getById()`) with model-specific populate logic.

---

## Architecture Diagrams

All design diagrams are included in the repository root as Mermaid markdown files:

- [er_diagram.md](./er_diagram.md) — Database schema relationships
- [class_diagram.md](./class_diagram.md) — OOP class structure
- [usecase_diagram.md](./usecase_diagram.md) — Actor use-case flows
- [sequence_diagram.md](./sequence_diagram.md) — Order placement sequence

---

## License

This project is for educational purposes.
