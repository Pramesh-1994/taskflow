# 🚀 TaskFlow — 3-Tier Application

A production-ready Task Management app demonstrating a clean **3-tier architecture** with a full DevOps pipeline.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   USER BROWSER                       │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP :3000
┌──────────────────────▼──────────────────────────────┐
│  TIER 1 — PRESENTATION (Frontend)                    │
│  React 18 + Axios + Nginx                            │
│  Container: taskflow-frontend                        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP :5000 (internal)
┌──────────────────────▼──────────────────────────────┐
│  TIER 2 — LOGIC (Backend)                            │
│  Node.js + Express REST API                          │
│  Container: taskflow-backend                         │
└──────────────────────┬──────────────────────────────┘
                       │ TCP :27017 (internal)
┌──────────────────────▼──────────────────────────────┐
│  TIER 3 — DATA (Database)                            │
│  MongoDB 7.0                                         │
│  Container: taskflow-mongo                           │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
taskflow/
├── frontend/               # Tier 1 — React UI
│   ├── src/
│   │   ├── App.js          # Main component
│   │   └── index.js        # Entry point
│   ├── public/index.html
│   ├── nginx.conf          # Nginx reverse proxy config
│   ├── Dockerfile          # Multi-stage build
│   └── package.json
│
├── backend/                # Tier 2 — Express API
│   ├── src/
│   │   ├── server.js       # App entry point
│   │   ├── models/Task.js  # Mongoose schema
│   │   ├── controllers/    # Business logic
│   │   └── routes/         # API routes
│   ├── Dockerfile
│   └── package.json
│
├── database/               # Tier 3 — MongoDB
│   └── init.js             # Seed script
│
├── docker-compose.yml      # Orchestrates all 3 tiers
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create a task |
| GET | /api/tasks/:id | Get one task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |
| GET | /health | Health check |

---

## 🐳 Running with Docker

```bash
# Build and start all 3 tiers
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes (clears DB)
docker-compose down -v
```

Open http://localhost:3000

---

## 💻 Running Locally (without Docker)

```bash
# Start MongoDB locally first
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm start
```

---

## 🔜 Next Steps (DevOps)

- [ ] GitHub Actions CI/CD Pipeline
- [ ] Kubernetes Deployment (Deployments, Services, Ingress)
- [ ] Helm Charts
- [ ] Monitoring with Prometheus + Grafana
- [ ] Log aggregation with ELK Stack
