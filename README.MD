# 🖥️ Zentrack Backend (`zentrackback`)

This is the **backend server** for the Clock Work Time App – a lightweight time-tracking solution designed to help users clock in/out of shifts, review their work logs, and manage time effectively.

Built with **Express.js**, it serves a REST API that handles:

- ✅ User authentication and session tracking
- 🕒 Shift management (start, stop, manual entry)
- 🌍 Time synchronization (including Berlin time fallback logic)
- 🗂️ Uses local in-memory or file-based data (no database required)

---

## ⚙️ Tech Stack

- **Node.js** + **Express**
- **Nodemon** for hot-reloading in development
- **Cookie-Parser** for session management
- **bcrypt** for password encryption
- **Cryptr** for secure token handling
- **CORS** for safe frontend-backend integration
- **No Database** – uses local files for data storage


---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18

### Installation

- npm install

### Running the Server
# Development mode
npm run dev

# Production mode
npm run server:prod
