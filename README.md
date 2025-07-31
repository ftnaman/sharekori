# ShareKori

**ShareKori** is a modern web platform that enables individuals and vendors to **lend, borrow, and rent physical items**—including tools, electronics, and everyday household goods. It supports both **Peer-to-Peer (P2P)** and **Vendor-driven** models, promoting sustainability, circular economy, and community trust.

---

## 🧭 Table of Contents

- [📦 ShareKori](#-sharekori)
- [🧭 Table of Contents](#-table-of-contents)
- [🚀 Overview](#-overview)
- [💼 Business Model](#-business-model)
- [🌟 Features](#-features)
- [📊 Tiered Lending Rules](#-tiered-lending-rules)
- [🔐 Safety & Risk Control](#-safety--risk-control)
- [💰 Monetization](#-monetization)
- [🧠 Smart AI Features](#-smart-ai-features)
- [🧱 Tech Stack](#-tech-stack)
- [🛠️ Getting Started (Dev Mode)](#️-getting-started-dev-mode)
- [📫 Contact](#-contact)

---

## 🚀 Overview

| Platform Type | Description                                      |
|---------------|--------------------------------------------------|
| **Hybrid**    | Supports P2P rentals and commercial vendor listings. |
| **Secure**    | Identity verification, admin-monitored returns.  |
| **Flexible**  | Tiered item lending based on value and risk.     |

---

## 💼 Business Model

| Model Type     | Description                                 | Platform Fee | Risk Handling                                                                 |
|----------------|---------------------------------------------|--------------|--------------------------------------------------------------------------------|
| **Peer-to-Peer** | Individual-to-individual rentals           | 5–10%        | 60% caution money collected by platform; user bears remaining 40%.            |
| **Vendor-Based** | Commercial vendors list for rent           | 12–15%       | Vendor assumes full risk; platform acts as facilitator.                      |

---

## 🌟 Features

| Feature Name             | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| **Item Listing**         | Users/vendors list items by category, photo, and pricing.                  |
| **Reservation System**   | Prevents overlaps via calendar booking.                                    |
| **Caution Money System** | Collects refundable deposit for P2P transactions (up to 60% item value).   |
| **Admin Return Checks**  | Admin validates return quality, handles disputes.                          |
| **Review & Rating**      | 2-way feedback system for transparency and trust.                          |
| **Waitlists**            | Users can join queues for high-demand items.                              |
| **Email Notifications**  | Return due alerts, confirmations, and platform updates.                   |
| **Admin Dashboard**      | Central control panel for managing users, disputes, payments, and listings.|

---

## 📊 Tiered Lending Rules

| Tier   | Item Value       | Who Can List     | Caution Policy             |
|--------|------------------|------------------|-----------------------------|
| Tier 1 | ৳0 – ৳1000        | P2P              | 30% caution (minimal risk)  |
| Tier 2 | ৳1001 – ৳3000     | P2P              | Full 60% caution applied    |
| Tier 3 | ৳3001+            | Vendors Only     | P2P not allowed             |

---

## 🔐 Safety & Risk Control

| Feature               | Description                                                             |
|------------------------|-------------------------------------------------------------------------|
| **Caution Money**      | Held securely during transaction (up to 60%)                            |
| **User Verification**  | NID, Passport, or Student ID required before borrowing/lending          |
| **Item Inspection**    | Photo verification and condition check pre/post rental                 |
| **AI Risk Flags**      | Monitors fraud patterns, suspicious behaviors                          |
| **Vendor Liability**   | Vendors must insure or accept risk of item damage/loss                  |
| **Dispute Resolution** | Admin arbitration and logs of communication                            |

---

## 💰 Monetization

| User Type   | Platform Fee | Revenue Sources                                      |
|-------------|--------------|------------------------------------------------------|
| P2P User    | 5–10%        | Transaction fee + caution deposit float              |
| Vendor      | 12–15%       | Fee per rental transaction                          |

---

## 🧠 Smart AI Features

| AI Feature               | Purpose                                                        |
|--------------------------|----------------------------------------------------------------|
| **Reliability Score**    | Tracks user history and flags untrustworthy behavior           |
| **Trending Items**       | Highlights most-rented items and seasonal popularity           |
| **Review Summarization** | AI-generated summaries of item and user feedback               |

---

## 🧱 Tech Stack

| Layer       | Technology                   |
|-------------|------------------------------|
| **Frontend**| React.js                     |
| **Backend** | Node.js (Express)            |
| **Database**| PostgreSQL (via Supabase)    |
| **Auth**    | Supabase Auth                |
| **Email**   | Nodemailer + Node-Cron       |
| **AI Layer**| Ollama (LLaMA2 / Mistral)    |
| **Payments**| SSLCommerz (BD) / Stripe     |
| **Hosting** | Vercel (Frontend), Render (API), Supabase (DB) |

---

## 🛠️ Getting Started (Dev Mode)

### 🚧 Frontend

```bash
cd client
npm install
npm run dev
