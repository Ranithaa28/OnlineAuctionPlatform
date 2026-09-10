# 🔨 Auction Bazaar — Online Auction Platform

A full-stack Online Auction Platform built with **Spring Boot** (Java) backend and **React** frontend, featuring real-time bidding via WebSockets, email notifications via Brevo SMTP, JWT authentication, and an Admin Dashboard.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🖥️ Frontend (Local) | http://localhost:3000 |
| ⚙️ Backend API (Local) | http://localhost:8080 |

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login & registration
- 🏷️ **Auction Management** — Create, update, browse auctions with images
- ⚡ **Real-time Bidding** — Live bid updates via WebSockets (STOMP/SockJS)
- 📧 **Email Notifications** via Brevo SMTP:
  - New bid placed → Owner & Bidder notified
  - Auction ended → Winner & Admin notified
- 👑 **Admin Dashboard** — Manage users (block/promote/delete), view all auctions & bids
- 🏆 **Auction Winner Display** — Ended auctions show winner and final bid
- 🔄 **Real-time Account Sync** — Admin changes (block/promote) reflect immediately

---

## 🛠️ Tech Stack

### Backend
- Java 17 + Spring Boot 3.4.2
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL Database
- Spring WebSocket (STOMP)
- JavaMail (Brevo SMTP)

### Frontend
- React 18
- React Router v6
- SockJS + STOMP.js (WebSocket)
- React Toastify
- React Icons

---

## 🚀 Local Deployment

### Prerequisites
- Java 17+
- Maven
- MySQL 8+
- Node.js 18+

### 1. Clone the Repository
```bash
git clone https://github.com/Ranithaa28/OnlineAuctionPlatform.git
cd OnlineAuctionPlatform
```

### 2. Set Up MySQL Database
```sql
CREATE DATABASE auction_platform;
CREATE USER 'auction_app'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON auction_platform.* TO 'auction_app'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Environment Variables
Set the following environment variables on your system:

| Variable | Description |
|----------|-------------|
| `DB_PASSWORD` | Your MySQL password |
| `EMAIL_PASSWORD` | Your Brevo SMTP key |
| `JWT_SECRET` | A long secure random string |
| `ADMIN_EMAIL` | Admin account email |
| `ADMIN_PASSWORD` | Admin account password |

### 4. Run the Backend
```bash
cd Auction
./mvnw spring-boot:run
```
Backend starts at: **http://localhost:8080**

### 5. Run the Frontend
```bash
cd Auction-Frontend-main/my-app
npm install
npm start
```
Frontend starts at: **http://localhost:3000**

---

## 📧 Email Configuration (Brevo SMTP)

1. Sign up at [brevo.com](https://brevo.com)
2. Go to **Settings → SMTP & API** → copy your SMTP key
3. Set `EMAIL_PASSWORD` environment variable with your SMTP key
4. In Brevo Security settings, authorize your IP or deactivate IP restriction for SMTP

---

## 🗂️ Project Structure

```
OnlineAuctionPlatform/
├── Auction/                    # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/auctionbazaar/
│   │       ├── controller/     # REST Controllers
│   │       ├── service/        # Business Logic
│   │       ├── model/          # JPA Entities
│   │       ├── repository/     # Data Repositories
│   │       ├── security/       # JWT + Spring Security
│   │       └── config/         # App Configuration
│   └── src/main/resources/
│       └── application.properties
│
└── Auction-Frontend-main/      # React Frontend
    └── my-app/
        └── src/
            ├── components/     # Reusable Components
            ├── pages/          # Page Components
            ├── services/       # API Service Calls
            ├── context/        # Auth Context
            └── config/         # API URL Config
```

---

## 🔑 Default Admin Credentials

Configured via environment variables `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

---

## 📄 License

This project is for educational purposes.
