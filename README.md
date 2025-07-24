# Share Koro

**Share Koro** is a full-stack web service that enables individuals within a neighborhood or community to **lend and borrow physical items** across a variety of categories—such as tools, books, appliances, electronics, and household items. The platform is designed to promote resource efficiency, reduce waste, and foster a sense of trust and cooperation among users.

Essentially, Share Koro functions as a **peer-to-peer rental and lending system**, where users can:
- List their personal items for others to borrow
- Browse available items by category or keyword
- Book items for specific dates
- Rate and review lending experiences
- Track item condition and history
- Handle transactions securely, with refund and platform fee mechanisms built in

By combining a user-friendly interface with powerful backend functionality, Share Koro offers a sustainable and community-driven alternative to buying infrequently used items. It is particularly useful for densely populated areas, student housing, or small local communities where shared ownership can significantly reduce both cost and clutter.

---

## Features

### Core Functionalities

- **Item Reservation System**: Prevents double-booking through conflict detection based on reservation dates.
- **Condition History Log**: Tracks item condition before and after every loan cycle.
- **Borrower Rating System**: Users can rate each other after each transaction to ensure transparency.
- **Auto-Return Reminders**: Sends email alerts before the due return date.
- **Item Categories and Tagging**: Enables advanced search and filtering by type, tag, or keyword.
- **Availability Calendar**: Displays a calendar view of when an item is booked or available.
- **Damage or Loss Reporting**: Allows users to report any issues related to item damage or loss.
- **Shared Ownership Support**: Multiple users can co-own and manage an item listing.
- **Delivery and Condition Checking**: Includes a delivery log and condition verification both upon sending and receiving an item.
- **Refund and Compensation System**: Offers a refund policy in case of theft or significant damage by the borrower.
- **Platform Fee System**: Allows the platform to charge a small service fee per transaction to support operations.

### AI-Powered Enhancements (Ollama Integration)

- **LLM-Powered Review Analysis**: Reviews are analyzed locally using open-source LLMs (such as LLaMA2 or Mistral) via Ollama to extract sentiment, generate summaries, and classify feedback.
- **Borrower and Lender Trust Scores**: Dynamic reliability scores are generated for users based on previous reviews and extracted patterns to guide safer transactions.

### Additional Useful Features

- **Waitlist System**: Users can join a waitlist for items that are currently reserved and will be notified when the item becomes available.
- **Multi-Item Booking**: Users can reserve multiple items in a single transaction.
- **User Profile Management**: Users can update their contact details and view their full borrowing and lending history.
- **Simple Search Bar**: Allows quick text-based searching across item titles and tags.
- **Reservation Cancellation**: Bookings can be canceled within the platform with appropriate status updates.
- **Responsive Design**: Fully responsive UI optimized for both desktop and mobile devices.
- **Basic Notifications**: Alerts and updates are sent for new bookings, returns, waitlist availability, and system messages.
- **Admin Dashboard**: An internal dashboard for managing users, listings, reports, flagged content, and platform fees.
- **Secure Payment Integration**: Integrates with SSLCommerz (or other Bangladeshi payment gateways) to handle deposits or advance rental payments.

---

## Technology Stack

| Layer           | Technology                               |
|----------------|-------------------------------------------|
| Frontend        | React.js                                 |
| Backend         | Node.js with Express                     |
| Database        | PostgreSQL (hosted on Supabase)          |
| Email System    | Nodemailer with Node-Cron                |
| Payment Gateway | SSLCommerz or equivalent (Bangladesh)    |
| AI/NLP Engine   | Ollama (local LLM runner)                |
| Hosting         | Supabase (Database), Vercel/Render (Web/API) |

---

## Local AI Integration with Ollama

This project uses [Ollama](https://ollama.com/) to run open-source large language models locally for free.
