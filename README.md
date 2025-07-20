# Share Koro

**Share Koro** is a neighborhood peer-to-peer lending platform that enables residents to borrow and lend tools, books, appliances, and more. Built with **Express.js**, **MySQL**, and **React**, Share Koro helps communities share resources easily while building trust and accountability.

---

## Features

### Core Features
- **Item Reservation System:** Prevent double-booking with date conflict checks.  
- **Condition History Log:** Track item condition before and after each borrow.  
- **Borrower Rating System:** Rate and review lending experiences.  
- **Auto-Return Reminders:** Email alerts before return deadlines.  
- **Item Categories & Tagging:** Search and filter items by type or tags.  
- **Availability Calendar:** Visualize booking schedules per item.  
- **Damage/Loss Incident Reporting:** Log and manage damage or loss issues.  
- **Shared Ownership:** Support multiple owners per item.

### Additional Useful Features
- **Waitlist System:** Join a waitlist for reserved items and get notified when available.  
- **Multi-Item Booking:** Reserve multiple items in one request.  
- **User Profile Management:** Update contact info and view borrowing history.  
- **Simple Search Bar:** Quick keyword search on item titles and categories.  
- **Reservation Cancellation:** Cancel bookings with proper status updates.  
- **Responsive Design:** Works well on both desktop and mobile devices.  
- **Basic Notifications:** Alerts for bookings, returns, and messages.  
- **Admin Dashboard:** Manage users, items, and incident reports.

---

## Technology Stack

- Frontend: React.js  
- Backend: Node.js with Express  
- Database: MySQL (using raw SQL queries)  
- Email Notifications: Nodemailer with scheduled tasks (e.g., node-cron)

---

## Getting Started

### Prerequisites

- Node.js v16+  
- MySQL Server  
- npm or yarn package manager  

### Installation

1. Clone the repo:

```bash
git clone https://github.com/yourusername/share-koro.git
cd share-koro
