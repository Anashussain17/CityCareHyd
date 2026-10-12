

# 🏙️ CityCare Hyd

**CityCare Hyd** is a civic issue reporting platform designed to make **Hyderabad cleaner and safer** by bridging the gap between **citizens and local authorities**.
It allows users to **report civic problems** - such as potholes, garbage accumulation, water supply issues, or damaged streetlights - with just a few taps.
Each report is made visible to local authorities who can respond, upload resolution proofs, and ensure accountability.

---

## 🚀 Features

### 🧍‍♂️ User End

* **Easy Issue Reporting:** Upload an image, auto-fetch your location, and describe the issue in seconds.
* **Real-Time Updates:** Track the progress of your reported issues — from *Pending* to *Resolved*.
* **Community Transparency:** View other users’ reports in your area and see how local authorities respond.

### 🏛️ Authority Panel

* **Dashboard Overview:** View and manage all reported issues (pending/resolved) within assigned constituencies or areas.
* **Resolution Management:** Upload resolution proof images, add comments, and mark issues as resolved.
* **Communication Layer:** Authorities can leave feedback or clarifications directly on issue threads.

### ⚙️ Tech Stack

**Frontend:** React + Tailwind CSS + Framer Motion (for smooth UI animations)
**Backend:** Node.js + Express + MongoDB (Mongoose), express-validator
**Photos:** Cloudinary
**Email:** Resend
**Hosting:**

* Frontend → cPanel subdomain: [reportmla.anashussain.xyz](https://reportmla.anashussain.xyz)
* Backend → [Render](https://render.com)

---

## 🔒 Key Functionalities

* Secure user authentication (JWT-based, bcrypt-hashed passwords)
* Role-based access for **Users** and **Authorities**, enforced on the server
* Photo uploads checked for type (JPG/PNG/WebP) and size (5 MB), stored on **Cloudinary**
* Request validation on every write route
* Responsive UI across all devices
* Clean and minimal dashboard design using Tailwind CSS
* Real-time data fetching for fast backend communication

---

## 🧑‍💻 Running locally

```bash
# Backend
cd backend
cp .env.example .env      # fill in MongoDB URL and JWT secret at least
npm install
npm start                 # http://localhost:5717

# Frontend
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:5717
npm install
npm run dev
```

Without Cloudinary keys, photos are saved to `backend/uploads/` so the app still works locally.

### Authority accounts

Authority access is stored on the user (`isAdmin`) and checked on every `/api/authority` request. To grant or remove it for an existing account:

```bash
cd backend
npm run make-authority -- someone@example.com
npm run make-authority -- someone@example.com --remove
```

### Deploying

* **Frontend:** `npm run build`, then upload the contents of `frontend/dist/` to the subdomain's folder in cPanel. The included `.htaccess` sends every route to `index.html` so page refreshes work.
* **Backend:** Render runs `npm start` in `backend/`. Set the variables from `backend/.env.example`, including `CORS_ORIGINS` (the frontend address) and `EMAIL_FROM` (a sender on a domain verified in Resend).

---

## 🌍 Vision

CityCare Hyd is more than just an app - it’s a **digital movement** for civic improvement.
By promoting transparency, accountability, and collaboration between citizens and governing bodies, it aims to create a smarter, cleaner, and more responsive Hyderabad.

---

## 📬 Contact

**Developer:** Anas Hussain
📧 Email: anashussain1702@gmail.com
🌐 Website: [https://anashussain.xyz](https://anashussain.xyz)


