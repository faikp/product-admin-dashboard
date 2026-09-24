# Product Admin Dashboard

A responsive Product Admin Dashboard built with Next.js, React, Tailwind CSS, Axios, and DummyJSON API.

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Axios
- JavaScript
- DummyJSON API
- Git & GitHub

## Features

### Authentication
- Login using DummyJSON authentication API
- Login validation
- Access token stored in localStorage
- Protected product pages
- Logout functionality

### Product Listing
- Fetch products from DummyJSON API
- Responsive desktop table
- Responsive mobile cards
- Product image
- Title
- Category
- Price
- Rating
- Stock

### Search
- Product search using DummyJSON API
- Debounced search
- AbortController used to cancel previous requests
- Search resets pagination to page 1

### Pagination
- API-based pagination using limit and skip
- Page numbers
- Previous and Next buttons
- Page size options: 10, 20 and 50
- Page state stored in URL

### Category Filtering
- Categories fetched from API
- Filter products by category
- Pagination resets when category changes

### Sorting
Products can be sorted by:

- Price
- Rating
- Title

### Product Details
- Dynamic product details page
- Product images
- Description
- Price
- Rating
- Reviews
- Product not found handling

### URL State
The following values are stored in the URL:

- Page
- Search
- Category
- Sort

This allows the current product-listing state to be refreshed or shared through the URL.

### Responsive Design
The dashboard is responsive for:

- Desktop
- Tablet
- Mobile

## API

This project uses the DummyJSON API.

Main endpoints:

```text
POST /auth/login

GET /products
GET /products/search?q=
GET /products/categories
GET /products/category/:category
GET /products/:id
POST /products/add
PUT /products/:id
DELETE /products/:id
```

## Demo Login

```text
Username: emilys
Password: emilyspass
```

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Open the project:

```bash
cd product-admin-dashboard-v2
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Project Structure

```text
src/
├── app/
│   ├── login/
│   ├── products/
│   │   ├── add/
│   │   ├── [id]/
│   │   └── page.jsx
│   ├── page.jsx
│   └── globals.css
│
├── lib/
│   └── axios.js
│
└── services/
    ├── auth.js
    ├── product.js
    └── localProducts.js
```

## Important Implementation Details

### Debounced Search

Search requests are delayed until the user stops typing.

AbortController is used to cancel previous requests so older search results do not replace newer results.

### API Separation

API calls are kept inside the `services` directory instead of being written directly inside UI components.

### DummyJSON Mutations

DummyJSON does not permanently persist product mutations.

LocalStorage is used for local product handling.

CRUD functionality is currently paused while the project is being finalized.

## Current Project Status

### Completed

- Authentication
- Protected product pages
- Product listing
- Responsive UI
- Search
- Debounced search
- Request cancellation
- Pagination
- Category filtering
- Sorting
- URL query parameters
- Product details
- LocalStorage handling

### Currently Paused

- Add Product UI
- Edit Product UI
- Delete Product UI

The related CRUD code remains in the project and can be continued later.

## AI Assistance

AI tools were used during development for:

- Understanding React and Next.js concepts
- Debugging errors
- Learning Tailwind CSS
- Structuring API services
- Reviewing implementation approaches

The code was manually implemented and tested while learning the concepts behind it.

## What I Learned

- React Hooks
- Next.js App Router
- Dynamic routes
- Axios API integration
- Authentication
- LocalStorage
- Debouncing
- AbortController
- Pagination
- URL query parameters
- Filtering and sorting
- Responsive Tailwind CSS
- Error handling
- Git and GitHub

## Author

Faik
