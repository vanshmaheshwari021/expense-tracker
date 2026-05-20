# MERN Expense Tracker

A full-stack expense tracker built from scratch with MongoDB, Express, React, and Node.js. The app lets you create, edit, delete, search, and filter income and expense transactions while keeping a live summary of total income, total expense, and current balance.

## Tech Stack

- MongoDB Atlas
- Express.js
- React
- Node.js
- Axios
- Plain CSS for responsive UI

## Features

- Add income and expense transactions
- Edit existing transactions
- Delete transactions with one click
- Search by transaction title
- Filter by type, category, and date range
- Live dashboard for balance, income, expense, and record count
- Responsive layout for desktop and mobile
- Loading, empty, and error states
- Backend validation for safe writes

## Project Structure

```text
expense-tracker/
├── client/
├── screenshots/
├── server/
├── .gitignore
└── README.md
```

## MongoDB Atlas Setup

1. Create a free account at MongoDB Atlas.
2. Create a free cluster.
3. Add a database user and password.
4. Whitelist your IP address, or allow access from anywhere for testing.
5. Copy the connection string and replace `<username>`, `<password>`, and database name.

## Environment Variables

Create `server/.env` using `server/.env.example` as a template:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/expense-tracker?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
```

If you already have a local MongoDB instance running, the backend can also fall back to `mongodb://127.0.0.1:27017/expense-tracker`.

## Installation

Open two terminals from the project root.

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm start
```

## Available Scripts

### Server

- `npm run dev` starts the backend with `nodemon`
- `npm start` starts the backend with Node

### Client

- `npm start` runs the React development server
- `npm run build` creates a production build

## API Endpoints

Base URL: `http://localhost:5000/api/transactions`

- `GET /` fetch all transactions
- `GET /stats` fetch summary totals
- `POST /` create a transaction
- `PUT /:id` update a transaction
- `DELETE /:id` remove a transaction

### Query Parameters

- `search`: search by title or description
- `type`: `income` or `expense`
- `category`: filter by category
- `startDate`: ISO date string
- `endDate`: ISO date string

## Validation Rules

### Frontend

- Title is required
- Amount must be greater than zero
- Type is required
- Date is required

### Backend

- Same checks as frontend
- Invalid dates are rejected
- Invalid `type` values are rejected
- Invalid MongoDB IDs are rejected

## Screenshots

The `screenshots/` folder includes starter mockups for submission slots:

- `dashboard-overview.svg`
- `transaction-form.svg`
- `transaction-list-filters.svg`

For final submission, replace them with real screenshots from your running app.

## How AI Was Used

- Planned the full-stack project structure
- Generated the Express API, React components, and CSS
- Drafted setup documentation and validation flow
- Helped create starter mockup assets for the README

## Submission Checklist

- CRUD operations are implemented
- Search and filters are included
- Balance, income, and expense totals are calculated
- Responsive UI is included
- `.env` is ignored through `.gitignore`
