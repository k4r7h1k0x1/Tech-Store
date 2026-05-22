# Tech-Store

A full-featured tech products e-commerce store built with Next.js and MongoDB. Browse smartphones, laptops, audio, wearables, cameras, and gaming gear — with cart management, user authentication, multiple payment methods, order tracking, product reviews, wishlist, and a contact page.

## Overview

Tech-Store is a custom online storefront for premium tech products. It delivers a fast, responsive shopping experience with category-based browsing, price range filtering, product badges (HOT, NEW, BEST SALE, PREMIUM), and a complete end-to-end purchase flow from cart to order confirmation.

## Features

- Product listing across 6 categories: Smartphones, Laptops, Audio, Wearables, Cameras, Gaming
- Product badges: HOT, NEW, BEST SALE, PREMIUM, BESTSELLER, SALE, Out of Stock
- Search bar with live product filtering
- Price range slider filter + In Stock / All availability toggle
- Product detail page with reviews
- Shopping cart sidebar with quantity management
- Wishlist support
- User authentication — Login / Sign Up modal with Google & Apple OAuth
- Checkout flow with shipping address management
- Multiple payment methods: Cash on Delivery, Credit/Debit Card, UPI
- Order summary with 18% tax calculation and free shipping
- Order confirmation with unique Order ID
- Orders page with full order history and delivery tracking
- Order status timeline: Placed → Confirmed → Processing → Shipped → Delivered
- User profile page
- Contact Us page with email/phone/address and message form
- Newsletter subscription in footer
- Responsive layout across all screen sizes

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + tailwindcss-animate |
| **UI Components** | Custom component library (components/ui) |
| **Authentication** | Custom JWT — authHelper, authService |
| **Database** | MongoDB (Mongoose) |
| **State Management** | React Context API |
| **API** | Next.js Route Handlers (App Router) |
| **Seeding** | Custom seed script (scripts/seed.ts) |
| **Deployment** | Vercel |

## Project Structure

```
clone/
├── app/
│   ├── api/
│   │   ├── address/
│   │   │   └── route.ts              # Address CRUD
│   │   ├── auth/
│   │   │   ├── login/                # Login endpoint
│   │   │   ├── logout/               # Logout endpoint
│   │   │   ├── me/                   # Get current user
│   │   │   └── signup/               # Register endpoint
│   │   ├── orders/
│   │   │   ├── checkout/             # Place order
│   │   │   └── get/                  # Fetch user orders
│   │   ├── products/
│   │   │   ├── [id]/
│   │   │   │   ├── reviews/          # Product reviews
│   │   │   │   └── route.ts          # Single product
│   │   │   └── route.ts              # All products
│   │   ├── reviews/                  # Reviews API
│   │   └── wishlist/                 # Wishlist API
│   ├── checkout/                     # Checkout page
│   ├── contactUS/                    # Contact Us page
│   ├── context/                      # React Context providers
│   ├── orders/                       # Orders history page
│   ├── product/[id]/
│   │   └── page.tsx                  # Product detail page
│   ├── profile/                      # User profile page
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx                    # Root layout
│   ├── OrdersClient.tsx
│   └── page.tsx                      # Home page
│
├── components/
│   ├── AuthModal.tsx                 # Login / Sign Up modal
│   ├── CartSidebar.tsx               # Slide-out cart
│   ├── Footer.tsx                    # Footer with links & newsletter
│   ├── Hero.tsx                      # Homepage hero section
│   ├── Navbar.tsx                    # Top navigation bar
│   ├── ProductDetail.tsx             # Product detail view
│   ├── ProductList.tsx               # Product grid with filters
│   ├── Productreviews.tsx            # Product reviews section
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── radio-group.tsx
│       ├── slider.tsx
│       └── textarea.tsx
│
├── lib/
│   ├── authHelper.ts                 # JWT helpers
│   ├── authService.ts                # Auth business logic
│   ├── mongodb.ts                    # MongoDB connection
│   └── orderService.ts              # Order business logic
│
├── libs/
│   └── utils.ts                     # Shared utilities
│
├── models/
│   ├── Order.ts                      # Order schema
│   ├── Product.ts                    # Product schema
│   ├── Review.ts                     # Review schema
│   └── User.ts                       # User schema
│
├── scripts/
│   └── seed.ts                       # Database seeder
│
├── .env.local                        # Environment variables
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository

```
git clone https://github.com/k4r7h1k0x1/Tech-Store.git
cd Tech-Store
```

2. Install dependencies

```
npm install
```

3. Set up environment variables — create a `.env.local` file in the root:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Seed the database with sample products

```
npx tsx scripts/seed.ts
```

5. Run the development server

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/logout` | Logout current user |
| GET | `/api/auth/me` | Get authenticated user |
| GET | `/api/products` | List all products |
| GET | `/api/products/[id]` | Get single product |
| GET | `/api/products/[id]/reviews` | Get product reviews |
| POST | `/api/reviews` | Submit a review |
| GET/POST | `/api/address` | Manage shipping addresses |
| POST | `/api/orders/checkout` | Place an order |
| GET | `/api/orders/get` | Get user order history |
| GET/POST | `/api/wishlist` | Manage wishlist |

## Usage

### Browse & Filter Products

- Navigate to the home page to see all products
- Use the category tabs (Smartphones, Laptops, Audio, etc.) in the navbar or sidebar
- Adjust the price range slider to filter by budget (₹0 – ₹10,000)
- Toggle between All Products and In Stock Only

### Cart & Checkout

- Click **Add to Cart** on any product card to open the cart sidebar
- Review cart items and quantities
- Proceed to **Checkout** — select or add a shipping address
- Choose a payment method: Cash on Delivery, Credit/Debit Card, or UPI
- Click **Place Order** — receive a unique Order ID on success

### Order Tracking

- Click **Orders** in the navbar to view all past orders
- Each order shows status, estimated delivery date, tracking number, and delivery address
- Status timeline: Placed → Confirmed → Processing → Shipped → Delivered

### Authentication

- Click the user icon in the navbar to open the Login / Sign Up modal
- Sign in with email & password — JWT stored securely in cookies
- Session persists across page refreshes

## Build

```
npm run build
npm start
```

## Deployment

Deployed on Vercel. Push to `main` to trigger automatic deployment.

```
vercel --prod
```

## Disclaimer

This project is for educational and portfolio purposes.

## Credits

Built by [k4r7h1k0x1](https://github.com/k4r7h1k0x1)
