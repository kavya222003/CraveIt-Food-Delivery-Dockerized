# 🍕 CraveIt – Online Food Delivery Web Application

> A fully containerized full-stack food delivery platform inspired by Swiggy, built end-to-end with Angular 19 and ASP.NET Core .NET 10.

![Angular](https://img.shields.io/badge/Angular-19-red?style=flat&logo=angular)
![.NET](https://img.shields.io/badge/.NET-10-purple?style=flat&logo=dotnet)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2019-blue?style=flat&logo=microsoftsqlserver)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?style=flat&logo=docker)
![JWT](https://img.shields.io/badge/Auth-JWT-green?style=flat)
![nginx](https://img.shields.io/badge/nginx-Reverse%20Proxy-green?style=flat&logo=nginx)

---

## 📌 About

CraveIt is a full-stack food delivery web application that allows users to browse restaurants by city, explore menus, add items to cart, place orders, and track order history. It supports **9 Indian cities** with **90+ restaurants** and **1000+ menu items**.

This version is **fully containerized using Docker** — the entire stack (Angular frontend, ASP.NET Core API, and SQL Server database) runs in isolated containers and can be started with a single command.

---

## ✨ Features

### 👤 User Features
- City-based restaurant discovery (9 Indian cities)
- Browse restaurants and filter menu items by category
- Add items to cart with multi-restaurant protection
- Place orders with delivery address and payment method
- View order history and track order status
- Simulated payment processing (COD / UPI / Card)

### 🔐 Authentication
- JWT-based authentication with BCrypt password hashing
- Role-based access control (Admin / Customer)
- Auto-attaching auth headers via HTTP interceptor
- Route guards for protected pages

### 🛠️ Admin Panel
- Live dashboard with stats (orders today, revenue, active restaurants)
- Full CRUD for restaurants and menu items
- Order management with status updates
- User management and role overview

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19 (Standalone Components) |
| Backend | ASP.NET Core Web API (.NET 10) |
| Database | SQL Server 2019 |
| ORM | Entity Framework Core 10 |
| Auth | JWT + BCrypt |
| State Management | RxJS BehaviorSubjects |
| Containerization | Docker + docker-compose |
| Web Server | nginx (reverse proxy) |
| API Docs | Scalar UI |

---

## 🐳 Docker Architecture

```
                    ┌─────────────────────────────────────┐
                    │         docker-compose               │
                    │                                      │
  Browser ──────────►  craveit-frontend (nginx:alpine)    │
  :4200             │         │                            │
                    │         │ proxy /api/*               │
                    │         ▼                            │
                    │  craveit-api (aspnet:10.0)    :5000  │
                    │         │                            │
                    │         │ SQL Server connection      │
                    │         ▼                            │
                    │  craveit-db (mssql:2019)      :1433  │
                    └─────────────────────────────────────┘
```

- **craveit-frontend** — Angular app served by nginx. nginx also acts as reverse proxy, routing `/api/*` calls to the API container internally
- **craveit-api** — ASP.NET Core API. Automatically runs EF Core migrations on startup with retry logic
- **craveit-db** — SQL Server 2019 with persistent volume

---

## 🚀 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- At least **4GB RAM** allocated to Docker

### Run with Docker

**Step 1 — Clone the repository**
```bash
git clone https://github.com/kavya222003/CraveIt-Food-Delivery-Dockerized.git
cd CraveIt-Food-Delivery-Dockerized
```

**Step 2 — Start all containers**
```bash
docker-compose up --build -d
```
This builds and starts 3 containers. First run takes 10-15 minutes (downloading base images). Subsequent runs are much faster.

**Step 3 — Seed the database**
```bash
docker cp seed.sql craveit-db:/seed.sql
docker exec -it craveit-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "CraveIt@123!" -No -i /seed.sql
```

**Step 4 — Open the app**

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| API | http://localhost:5000/api |
| API Docs (Scalar) | http://localhost:5000/scalar |

---

## 🗂️ Project Structure

```
FoodOrderingApp/
├── OlnlineFoodOrderingAPI/       # ASP.NET Core Web API
│   ├── Controllers/              # Auth, Restaurants, MenuItems, Orders, Payments, Admin
│   ├── Services/                 # Business logic layer
│   ├── Models/                   # Entity models
│   ├── DTOs/                     # Data transfer objects
│   ├── Data/                     # AppDbContext + Migrations
│   └── Dockerfile                # Multi-stage build
├── FoodOrdering.Client/          # Angular 19 Frontend
│   ├── src/app/
│   │   ├── components/           # All UI components
│   │   ├── services/             # API services + state management
│   │   ├── guards/               # authGuard + adminGuard
│   │   ├── interceptors/         # JWT interceptor
│   │   └── models/               # TypeScript interfaces
│   ├── nginx.conf                # Reverse proxy config
│   └── Dockerfile                # Multi-stage build
├── docker-compose.yml            # Orchestrates all 3 containers
└── seed.sql                      # Database seed data (90+ restaurants, 1000+ menu items)
```

---

## 🔑 Key Technical Highlights

**Multi-stage Docker Builds** — The build stage compiles the code and the runtime stage runs a much smaller image without the SDK, significantly reducing image size.

**nginx Reverse Proxy** — Angular is served by nginx which also proxies `/api/*` requests to the API container internally. The browser only talks to one port.

**Auto Migration on Startup** — The API automatically runs EF Core migrations when it starts, with a retry loop that waits for SQL Server to be ready.

**Lazy Loading** — Every Angular route uses `loadComponent` so page code is only downloaded when first visited.

**JWT HTTP Interceptor** — Automatically attaches `Authorization: Bearer {token}` to every outgoing API request.

**RxJS BehaviorSubjects** — City selection and cart state managed reactively without NgRx.

**Database Transactions** — Order placement creates Order, OrderItems, and Payment records atomically. Full rollback on failure.

---

## 🌆 Supported Cities

Vijayawada • Mumbai • Delhi • Chennai • Kolkata • Bangalore • Hyderabad • Pune • Ahmedabad

---

## 🔧 Useful Docker Commands

```bash
# Start all containers
docker-compose up -d

# Stop all containers
docker-compose down

# View API logs
docker-compose logs api

# View database logs
docker-compose logs db

# Rebuild after code changes
docker-compose up --build -d

# Reset everything including database volume
docker-compose down -v
```

---

## 🔐 Default Credentials

After seeding, set a user as Admin by running:
```sql
docker exec -it craveit-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "CraveIt@123!" -No -Q "USE FoodOrderingDB; UPDATE Users SET Role='Admin' WHERE Email='your@email.com'"
```

---

## 👩‍💻 Author

**Tungala Kavya Sri**
- 📧 tungalakavyasri@gmail.com
- 💼 [LinkedIn](https://www.linkedin.com/in/tungala-kavya-sri)
- 🐙 [GitHub](https://github.com/kavya222003)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
