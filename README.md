# Sharekori - Item Rental Platform Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Frontend Features](#frontend-features)
8. [Backend Features](#backend-features)
9. [User Workflows](#user-workflows)
10. [File Structure](#file-structure)
11. [Configuration](#configuration)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)

## Project Overview

Sharekori is a peer-to-peer item rental platform that allows users to rent out their items or rent items from others. The platform facilitates secure transactions, user ratings, and efficient item management.

### Key Features
- User registration and authentication
- Item listing and management
- Search and filtering capabilities
- Rental request system
- User ratings and reviews
- Payment integration (demo)
- Responsive design
- Real-time availability tracking

## Technology Stack

### Frontend
- **HTML5** - Structure and semantics
- **CSS3** - Styling and responsive design
- **JavaScript (ES6+)** - Client-side functionality
- **Bootstrap 5.3** - UI framework
- **Flatpickr** - Date picker component

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database management
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### Database
- **MySQL** - Relational database
- **Connection pooling** - Efficient database connections

## Project Structure

```
sharekori/
├── backend/
│   ├── controllers/
│   │   └── userController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── itemRoutes.js
│   │   ├── rentalRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── ratingRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/
│   ├── app.js
│   ├── database.js
│   └── package.json
├── frontend/
│   ├── *.html (pages)
│   ├── *.js (scripts)
│   ├── *.css (styles)
│   └── images/
└── documentation.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=sharekori_db
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Database Setup**
   ```sql
   CREATE DATABASE sharekori_db;
   USE sharekori_db;
   ```

5. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Serve the application**
   Use any static file server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server -p 8000
   
   # Using Live Server (VS Code extension)
   ```


## Database Schema

<img width="960" height="507" alt="er_diagram" src="https://github.com/user-attachments/assets/c8da84c5-7642-49d6-86f6-ac6931bdd6a7" />

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) DEFAULT '+880-XXX-XXXXXX'
);
```

### Items Table
```sql
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    item_description TEXT,
    rent_per_day DECIMAL(10,2) NOT NULL,
    item_condition ENUM('Almost New','Used','Refurbished') NOT NULL DEFAULT 'Used',
    category VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    image_url VARCHAR(255),
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

### Rental Requests Table
```sql
CREATE TABLE rental_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    renter_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    delivered_status BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (item_id) REFERENCES items(id),
    FOREIGN KEY (renter_id) REFERENCES users(id)
);
```

### Payments Table
```sql
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rental_request_id INT NOT NULL,
    payer_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(100),
    FOREIGN KEY (rental_request_id) REFERENCES rental_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### User Ratings Table
```sql
CREATE TABLE user_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rated_user_id INT NOT NULL,
    rater_user_id INT NOT NULL,
    rental_id INT NOT NULL,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (rater_user_id, rental_id),
    FOREIGN KEY (rated_user_id) REFERENCES users(id),
    FOREIGN KEY (rater_user_id) REFERENCES users(id),
    FOREIGN KEY (rental_id) REFERENCES rental_requests(id)
);

```

## API Documentation

### Authentication Endpoints

#### POST /api/users/register
Register a new user.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword"
}
```

#### POST /api/users/login
Authenticate user and get JWT token.
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### GET /api/users/me
Get current user information (requires authentication).

#### GET /api/users/phone/:userId
Get user's phone number (requires authentication).

### Item Endpoints

#### GET /api/items/
Get all items with optional filtering.
```
Query parameters:
- category: Filter by category
- condition: Filter by condition
- search: Search in title/description
- page: Page number for pagination
- limit: Items per page
```

#### POST /api/items/
Create a new item (requires authentication).
```json
{
  "title": "Item Title",
  "item_description": "Description",
  "rent_per_day": 50.00,
  "item_condition": "Used",
  "category": "Electronics",
  "location": "Dhaka, Bangladesh"
}
```

#### GET /api/items/:id
Get specific item details.

#### GET /api/items/:id/image
Get item image.

#### DELETE /api/items/:id
Delete an item (requires authentication, owner only).

### Rental Endpoints

#### POST /api/rentals/
Create a rental request (requires authentication).
```json
{
  "item_id": 1,
  "start_date": "2024-01-15",
  "end_date": "2024-01-20"
}
```

#### GET /api/rentals/my-rentals
Get user's rental history (requires authentication).

#### GET /api/rentals/my-requests
Get user's rental requests (requires authentication).

#### GET /api/rentals/item-requests
Get rental requests for user's items (requires authentication).

#### PUT /api/rentals/mark-delivered/:requestId
Mark rental request as delivered (requires authentication).

#### GET /api/rentals/availability/:itemId
Get item availability dates.

### Review Endpoints

#### GET /api/reviews/item/:itemId
Get reviews for a specific item.

#### POST /api/reviews/
Create a review (requires authentication).
```json
{
  "item_id": 1,
  "stars": 5,
  "comment": "Great item!"
}
```

### Rating Endpoints

#### POST /api/ratings/owner
Rate an item owner (requires authentication).
```json
{
  "owner_id": 1,
  "rating": 5,
  "comment": "Excellent service"
}
```

### Payment Endpoints

#### POST /api/payments/demo
Process demo payment (requires authentication).
```json
{
  "rental_id": 1,
  "payment_method": "demo-gateway"
}
```

## Frontend Features

### Pages

#### 1. Homepage (homepage.html)
- Search functionality with filters
- Featured products display
- Typewriter effect for search
- Responsive design

#### 2. Browse Page (browse.html)
- Advanced search and filtering
- Pagination support
- Category-based filtering
- Condition-based filtering

#### 3. Item Details Page (item.html)
- Large item image display
- Item information
- Owner rating display
- Rental booking form
- Reviews section
- Availability calendar

#### 4. Dashboard (dashboard.html)
- User welcome message
- Item management (add/remove items)
- Rental history
- Rental requests management
- Delivery status tracking

#### 5. Authentication Pages
- Login (login.html)
- Registration (register.html) with phone number

#### 6. How It Works Page (how-it-works.html)
- Step-by-step process explanation
- Feature highlights
- Call-to-action sections

### Components

#### Navbar (navbar.js)
- Dynamic navigation based on authentication status
- Responsive design
- Active page highlighting
- User-specific actions

#### Search System
- Unified search bar
- Category dropdown
- Condition filtering
- Real-time results

#### Rating System
- Star-based ratings
- Review comments
- Owner ratings
- User feedback

## Backend Features

### Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes middleware
- User session management

### File Management
- Image upload handling
- File validation
- Storage management
- Image serving

### Database Operations
- Connection pooling
- Prepared statements
- Transaction support
- Error handling

### Business Logic
- Rental availability checking
- Payment processing (demo)
- Rating calculations
- User verification

## User Workflows

### Item Owner Workflow
1. **Registration**: Create account with phone number
2. **Add Items**: Upload item details and images
3. **Manage Requests**: View and respond to rental requests
4. **Track Rentals**: Monitor item usage and returns
5. **Receive Ratings**: Get feedback from renters

### Renter Workflow
1. **Browse Items**: Search and filter available items
2. **View Details**: Check item information and reviews
3. **Make Request**: Select dates and submit rental request
4. **Track Status**: Monitor request and delivery status
5. **Mark Delivered**: Confirm item receipt
6. **Leave Reviews**: Rate items and owners

### Rental Process
1. **Request Creation**: Renter submits rental request
2. **Payment Processing**: Demo payment integration
3. **Item Delivery**: Owner delivers item to renter
4. **Status Update**: Renter marks item as delivered
5. **Return Process**: Renter returns item to owner
6. **Review Exchange**: Both parties leave ratings

## File Structure

### Frontend Files
```
frontend/
├── homepage.html          # Landing page
├── browse.html           # Item browsing page
├── item.html             # Item details page
├── dashboard.html        # User dashboard
├── login.html            # Login page
├── register.html         # Registration page
├── how-it-works.html     # Information page
├── homepage.js           # Homepage functionality
├── browse.js             # Browse page functionality
├── item.js               # Item page functionality
├── dashboard.js          # Dashboard functionality
├── navbar.js             # Navigation component
├── script.js             # Authentication scripts
├── styles.css            # Main stylesheet
├── item.css              # Item page styles
├── dashboard.css         # Dashboard styles
├── authForm.css          # Authentication form styles
├── navbar.css            # Navigation styles
└── images/               # Static images
    ├── sharekori_logo.png
    └── sharekori_dark_logo.png
```

### Backend Files
```
backend/
├── app.js                # Main application file
├── database.js           # Database connection
├── package.json          # Dependencies and scripts
├── controllers/
│   └── userController.js # User management logic
├── middlewares/
│   └── authMiddleware.js # Authentication middleware
├── routes/
│   ├── userRoutes.js     # User endpoints
│   ├── itemRoutes.js     # Item endpoints
│   ├── rentalRoutes.js   # Rental endpoints
│   ├── reviewRoutes.js   # Review endpoints
│   ├── ratingRoutes.js   # Rating endpoints
│   └── paymentRoutes.js  # Payment endpoints
└── uploads/              # File upload directory
```

## Configuration

### Environment Variables
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=sharekori_db

# JWT Configuration
JWT_SECRET=your_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Database Configuration
- **Host**: Local MySQL server
- **Port**: 3306 (default)
- **Character Set**: UTF-8
- **Connection Pool**: 10 connections

### Security Settings
- **JWT Expiration**: 1 hour
- **Password Hashing**: bcrypt with salt rounds 10
- **File Upload**: Image files only
- **CORS**: Enabled for development

## Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   PORT=3000
   ```

2. **Database Setup**
   - Use production MySQL server
   - Configure connection pooling
   - Set up backups

3. **File Storage**
   - Configure cloud storage (AWS S3, etc.)
   - Set up CDN for images

4. **Security**
   - Use HTTPS
   - Configure CORS properly
   - Set up rate limiting
   - Use environment variables

### Deployment Options

#### Heroku
```bash
# Add Heroku remote
heroku git:remote -a your-app-name

# Deploy
git push heroku main
```

#### AWS
- Use EC2 for backend
- Use S3 for file storage
- Use RDS for database
- Use CloudFront for CDN

#### Docker
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check MySQL service
sudo systemctl status mysql

# Test connection
mysql -u username -p -h localhost
```

#### Port Conflicts
```bash
# Check port usage
lsof -i :5000

# Kill process if needed
kill -9 PID
```

#### File Upload Issues
- Check upload directory permissions
- Verify file size limits
- Ensure proper MIME types

#### Authentication Issues
- Verify JWT secret
- Check token expiration
- Validate user credentials

### Error Codes

#### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **404**: Not Found
- **500**: Internal Server Error

#### Database Errors
- **ER_ACCESS_DENIED_ERROR**: Check database credentials
- **ER_NO_SUCH_TABLE**: Verify table creation
- **ER_DUP_ENTRY**: Duplicate entry constraint

### Performance Optimization

#### Database
- Use indexes on frequently queried columns
- Optimize queries with EXPLAIN
- Implement connection pooling
- Use prepared statements

#### Frontend
- Minify CSS and JavaScript
- Optimize images
- Use CDN for static assets
- Implement lazy loading

#### Backend
- Use compression middleware
- Implement caching
- Optimize file uploads
- Use async/await properly

## Contributing

### Development Guidelines
1. Follow existing code style
2. Add proper error handling
3. Include input validation
4. Write meaningful commit messages
5. Test thoroughly before submitting

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Follow consistent indentation
- Use ES6+ features where appropriate

### Testing
- Test all API endpoints
- Verify frontend functionality
- Check responsive design
- Validate form submissions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the troubleshooting section

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Maintainer**: Sharekori Development Team
