# BharaKoro

**BharaKoro** is a web platform where individuals can **lend, rent, and borrow physical items** like tools, electronics, and household goods. It supports both **Peer-to-Peer (P2P)** and **Vendor-driven** models with platform fees and strong risk control. The aim is to promote **shared usage**, **sustainability**, and **neighborhood trust** while maintaining **commercial viability**.

---

## 🔹 Overview of Business Model

| Model Type     | Description                                 | Platform Fee | Risk Management                                                                 |
|----------------|---------------------------------------------|--------------|----------------------------------------------------------------------------------|
| **P2P**        | Individuals lend to other individuals.      | 5–10%        | 60% of item value as caution money held by BharaKoro. Remaining 40% is user risk. |
| **Vendor-based** | Verified vendors rent items commercially. | 12–15%       | Vendor bears full risk; platform is not liable.                                  |

---

## ✅ Platform Highlights

- **Hybrid System**: Supports both P2P and vendor rentals.
- **Platform Fees**: Charged based on lender type.
- **Risk Mitigation**:
  - **Caution Money** (60%) taken from P2P borrowers.
  - **Vendor-only** listings allowed for high-risk/high-value items.
- **Tiered Lending**:
  - **Low-value items**: P2P permitted.
  - **High-value items**: Vendor-only.
- **Verification**: Identity checks and item verification before listing.
- **Secure Transactions**: Admin-mediated returns, deposits, and disputes.

---

## 🎯 Features

| Feature                    | Description                                                               |
|----------------------------|---------------------------------------------------------------------------|
| **Item Listing**           | Users and vendors can list rentable items by category and price.          |
| **Reservation System**     | Prevents booking conflicts and supports calendar-based rentals.           |
| **Caution Money System**   | 60% of item value locked for P2P rentals.                                 |
| **Return Tracking**        | Admin and user ratings used to monitor return quality and timing.         |
| **Review & Rating System** | Feedback on lenders and borrowers improves reliability.                   |
| **Waitlists**              | Join a queue for high-demand items.                                       |
| **Notifications**          | Email reminders for return dates and due payments.                        |
| **Admin Dashboard**        | Manage users, items, payments, and disputes.                              |

---

## 🔍 Tiered Lending Model

| Tier   | Item Value Range | Available To | Notes                          |
|--------|------------------|--------------|--------------------------------|
| Tier 1 | ৳0 – ৳1000        | P2P          | No or minimal caution (30%).   |
| Tier 2 | ৳1001 – ৳3000     | P2P          | Full 60% caution applied.      |
| Tier 3 | ৳3001+            | Vendor Only  | P2P not allowed due to risk.   |

---

## 🔐 Safety & Risk Management

| Safety Feature         | Description                                                      |
|------------------------|------------------------------------------------------------------|
| **Caution Money**      | 60% of item value held during P2P rental.                        |
| **Verification**       | NID/Student ID required for lenders and renters.                |
| **Item Checks**        | Condition reviewed before and after rental.                      |
| **AI Risk Detection**  | Reviews and behavior monitored for abuse.                        |
| **Vendor Liability**   | Vendors are responsible for lost/damaged items.                  |
| **Admin Oversight**    | Admin panel for dispute resolution and arbitration.              |

---

## 📊 Monetization Model

| User Type   | Platform Fee | Revenue Stream                                           |
|-------------|--------------|-----------------------------------------------------------|
| **P2P User**| 5–10%        | Transaction fee + interest from caution deposits (if held)|
| **Vendor**  | 12–15%       | Transaction fee on rentals                                |

---

## 🧠 Smart Features (AI-Enhanced)

- **User Behavior Analysis**: Generates reliability score.
- **Item Popularity Metrics**: Highlights trending items.
- **Review Summarization**: AI condenses reviews for fast insight.

---

## 🏗️ Tech Stack

| Layer       | Tech Used            |
|-------------|----------------------|
| Frontend    | React.js             |
| Backend     | Node.js (Express)    |
| Database    | PostgreSQL (Supabase)|
| AI Layer    | Ollama (LLaMA2/Mistral) |
| Auth        | Supabase Auth        |
| Email       | Nodemailer + Node-Cron|
| Payment     | SSLCommerz or Stripe |
| Hosting     | Vercel (frontend), Render (backend), Supabase (database) |

---

## 🛠️ Getting Started (Dev Mode)

```bash
# Frontend
cd client
npm install
npm run dev

# Backend
cd server
npm install
npm run dev
