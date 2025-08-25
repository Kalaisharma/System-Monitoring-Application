---

# 🖥️ Cross-Platform System Utility + Server + Admin Dashboard

## 📌 Overview

This project implements a **system monitoring solution** consisting of:

1. **System Utility (Client)** – A lightweight Go-based cross-platform utility to collect system health data.
2. **Backend Server (API + Storage)** – Node.js/Express + MongoDB backend to receive, store, and serve machine data.
3. **Admin Dashboard (Frontend)** – React + Material UI dashboard to visualize and filter machine health reports.

The system is designed to be:

* ✅ Cross-platform (Windows / macOS / Linux)
* ✅ Efficient (background daemon, minimal resource usage)
* ✅ Secure (HTTP API communication)
* ✅ Extendable (filters, CSV export, etc.)

---

## ⚙️ Features

### 1. System Utility (Go)

* Collects:

  * 🔒 Disk encryption status
  * 📦 OS update status (current vs latest)
  * 🛡️ Antivirus presence and status
  * ⏱️ Inactivity sleep settings (≤ 10 mins)
* Runs as a background daemon:

  * Checks system every **15 minutes**
  * Reports only if changes detected
  * Sends updates to backend API

### 2. Backend Server (Node.js + MongoDB)

* REST APIs:

  * `POST /api/machines` → Receive machine data
  * `GET /api/machines` → List all machines (with filters: OS, status, issues)
  * `GET /api/machines/export` → Export all machines as CSV
* Stores:

  * Machine ID
  * OS, Status, Issues, Details
  * Timestamps

### 3. Admin Dashboard (React + Material UI)

* Displays:

* Machine ID, OS, Status, Issues, Last check-in
* Filters by OS, Status, Issue
* Flags unhealthy configurations
* Auto-refreshes every **15 minutes**
* Export data as CSV

---

## 🏗️ Project Structure

```
/project-root
  ├── utility          # Go cross-platform system utility
  ├── backend          # Node.js/Express + MongoDB server
  ├── frontend         # React + Material UI dashboard
```

---

## 🚀 Setup Instructions

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/Kalaisharma/System-Monitoring-Application.git
cd System-Monitoring-Application
```

---

### 🔹 2. Backend Setup (Node.js + MongoDB)

```bash
cd backend
npm install
```

#### Configure Environment

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/system-monitor
NODE_ENV=development  #for deployment and testing
```

#### Run Server

```bash
npm start
```

Server will be running on **[http://localhost:5000](http://localhost:5000)**

---

### 🔹 3. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
```

#### Configure API Endpoint

Edit `frontend/src/services/machineServices.ts`:

```ts
const BASE_URL = "http://localhost:5000/api/machines";
```

#### Run Frontend

```bash
npm run dev
```

Dashboard will be available at **[http://localhost:5173](http://localhost:5173)** 

---

### 🔹 4. System Utility (Go)

Ensure you have **Go ≥1.21** installed.

#### Build

```bash
cd utility
go build -o system-utility  # creates a .exe file run as administrator
go run main.go  # runs locally without creating a build
```

#### Run

```bash
./system-utility  # using go run main.go skip this
```
---

## 📊 API Endpoints

### `POST /api/machines`

Submit machine data.

```json
{
  "MachineID": "M123",
  "OSName": "Windows",
  "DiskEncrypted: true,
  "OSUpToDate": false,
  "SleepOK": true,
  "Antivirus" :true
}

 
```

### `GET /api/machines`

Fetch list of machines (supports filters):

```
/api/machines?os=Windows&status=Warning&issue=Disk%20Encryption%20Disabled
```

### `GET /api/machines/export`

Exports all machine data to `machines.csv`.

---

## 🧪 Design Decisions

* **Go Utility** → Lightweight, cross-platform, easy background daemon support.
* **Node.js Backend** → Quick API development, async-friendly, integrates well with MongoDB.
* **MongoDB** → Flexible schema, ideal for storing machine data with varying issue lists.
* **React + MUI Frontend** → Clean, responsive UI with minimal setup time.

---
