# Rupantar Node Admin Server

A Node.js server with JWT authentication and Prisma ORM for database operations, following the Model-Controller-Routes pattern.

## Project Structure

```
├── config/             # Configuration files
│   ├── database.js     # Prisma client configuration
│   └── jwt.js          # JWT configuration
├── controllers/        # Business logic
│   ├── authController.js
│   ├── dataController.js
│   └── subscriptionController.js
├── middleware/         # Middleware functions
│   └── auth.js         # JWT verification middleware
├── models/             # Database models
│   ├── User.js
│   ├── Data.js
│   └── ShopSubscription.js
├── prisma/             # Prisma configuration
│   └── schema.prisma   # Schema definition
├── routes/             # API routes
│   ├── auth.js
│   ├── table.js
│   └── subscription.js
├── index.js            # Application entry point
└── .env                # Environment variables
```

## Features

- JWT-based authentication with 1-week token expiry
- Postgres database integration with Prisma ORM
- MVC pattern architecture
- Dynamic table access (specify table name via query parameter)
- Dedicated ShopSubscription API endpoints
- Endpoints for:
  - User login
  - Retrieving table data (GET)
  - Getting single record by ID (GET)
  - Creating new records (POST)
  - Updating records (POST)
  - Deleting records (DELETE)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Create a `.env` file in the root directory
   - Update the following variables:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
     JWT_SECRET="your_jwt_secret_key"
     PORT=3000
     ```

3. Prisma Setup:
   - This application uses Prisma to connect to your existing database
   - The DATABASE_URL should point to the database where your schema is already defined
   - Ensure the ShopSubscription table exists in your database

4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password

### Generic Table Operations
- `GET /api/table?table=yourTableName` - Get all records from the specified table
- `GET /api/table/:id?table=yourTableName` - Get a specific record by ID
- `POST /api/table?table=yourTableName` - Create a new record
- `POST /api/table/update` - Update an existing record (include table in the request body)
- `DELETE /api/table/:id?table=yourTableName` - Delete a record

### Shop Subscription Endpoints
- `GET /api/subscription?page=1&limit=20` - Get all shop subscriptions with pagination
- `GET /api/subscription/:id` - Get a specific shop subscription by ID
- `POST /api/subscription` - Create a new shop subscription or update if ID is provided
- `DELETE /api/subscription/:id` - Delete a shop subscription

## Working with Dynamic Tables

This API supports working with multiple tables dynamically. You can specify the table name in:

1. Query parameter: `?table=yourTableName`
2. Request body (for POST methods): `{ "table": "yourTableName", ... }`

If no table is specified, the system defaults to using 'targetTable'. Update this default in the model files if needed.

## Important Notes

- All API endpoints are protected and require a valid JWT token
- The token should be included in the Authorization header as: `Bearer YOUR_TOKEN`
- Make sure your database user has proper permissions for the tables you're accessing # admin-server
