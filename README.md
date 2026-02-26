# 🥭 Mango Fresh Farm E-commerce Website

A modern, full-stack e-commerce platform for selling fresh mangoes online. Built with Next.js 16, TypeScript, and PostgreSQL.

**Live Site:** [https://mango-ecommerce-website-ebon.vercel.app](https://mango-ecommerce-website-ebon.vercel.app)

<!-- Last updated: Feb 2026 -->

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Project](#-running-the-project)
- [Project Structure](#-project-structure)
- [Admin Panel](#-admin-panel)
- [Development Guidelines](#-development-guidelines)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **Prisma ORM** - Database ORM
- **PostgreSQL (Neon)** - Cloud database
- **Bcrypt.js** - Password hashing
- **JWT (jsonwebtoken)** - Authentication tokens

### Payment & Email
- **Razorpay** - Payment gateway
- **Resend** - Email service (order confirmations, password reset)

### Deployment
- **Vercel** - Hosting platform with CI/CD
- **GitHub** - Version control

---

## ✨ Features

### Customer Features
- 🛒 Product browsing with filtering
- 🛍️ Shopping cart management
- ❤️ Wishlist functionality
- 👤 User authentication (register/login)
- 🔐 Forgot password & reset
- 📦 Order placement with Razorpay
- 📧 Order confirmation emails
- 📱 Responsive design

### Admin Features
- 📊 Dashboard with metrics
- 📦 Product management (CRUD)
- 🖼️ Image upload for products
- 📋 Order management & status updates
- 👥 User management
- 🔒 Role-based access control

---

## 📦 Prerequisites

- **Node.js** (v20.9.0+)
- **npm** or **yarn**
- **Git**
- **VS Code** (recommended)

---

## 🛠️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Neha312002/mango-ecommerce-website.git
cd mango-ecommerce-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create `.env` file in root directory (ask project owner for values):

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RESEND_API_KEY="re_..."
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔑 Environment Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `DATABASE_URL` | PostgreSQL connection | Neon dashboard (ask owner) |
| `JWT_SECRET` | JWT signing secret | Generate random string |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key | Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | Razorpay dashboard |
| `RESEND_API_KEY` | Email API key | Resend dashboard |

---

## 🗄️ Database Setup

### Database Schema

Main models:
- **User** - Accounts (role: user/admin)
- **Product** - Mango varieties
- **Order** - Customer orders
- **OrderItem** - Order line items
- **Address** - Shipping addresses
- **Review** - Product reviews
- **WishlistItem** - User wishlist

### View Database

```bash
npx prisma studio
```

**Note:** Database is hosted on Neon cloud. Schema changes require manual SQL execution (ask owner).

---

## 🏃 Running the Project

```bash
# Development
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

---

## 📁 Project Structure

```
mango-ecommerce-website/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   └── images/                # Static assets
├── src/
│   └── app/                   # Next.js App Router
│       ├── api/               # API endpoints
│       │   ├── auth/          # Login, register, password reset
│       │   ├── products/      # Product CRUD
│       │   ├── orders/        # Order management
│       │   └── users/         # User endpoints
│       ├── admin/             # Admin panel
│       │   ├── products/      # Product management
│       │   ├── orders/        # Order management
│       │   └── users/         # User management
│       ├── auth/              # Login/Register page
│       ├── checkout/          # Checkout page
│       ├── forgot-password/   # Password reset request
│       ├── reset-password/    # Password reset with token
│       ├── account/           # User account
│       ├── wishlist/          # Wishlist page
│       └── context/
│           └── CartContext.tsx # Cart state
├── .env                       # Environment variables
├── next.config.ts             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

---

## 👨‍💼 Admin Panel

### Get Admin Access

1. Register account at `/auth`
2. Ask owner to run SQL:
   ```sql
   UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
   ```
3. Logout and login
4. Admin button appears in navbar
5. Access admin panel at `/admin`

### Admin Features

- 📊 Dashboard with metrics
- 📦 Products: Add/Edit/Delete with image upload
- 📋 Orders: View and update status
- 👥 Users: View all users

---

## 🧑‍💻 Development Guidelines

### Git Workflow

```bash
# Pull latest
git pull origin master

# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git add .
git commit -m "Description"

# Push
git push origin feature/your-feature
```

### Code Style

- Use TypeScript for all files
- Follow ESLint rules
- Use Tailwind CSS for styling
- Keep components small

### API Endpoint Pattern

```typescript
// src/app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Logic here
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
```

---

## 🚀 Deployment

### Vercel (Production)

- Auto-deployment from GitHub `master` branch
- Set environment variables in Vercel dashboard
- Database: Neon PostgreSQL (always connected)

### Manual Deploy

```bash
npm i -g vercel
vercel --prod
```

---

## 🔧 Troubleshooting

### Common Issues

**"Cannot find module @prisma/client"**
```bash
npx prisma generate
```

**TypeScript errors with Prisma**
```bash
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client
npx prisma generate
```

**Database connection error**
- Check `DATABASE_URL` in `.env`
- Verify Neon database is accessible

**Admin panel unauthorized**
- Verify `role = 'admin'` in database
- Clear localStorage and re-login
- Check JWT token contains role field

**Port 3000 in use**
```bash
# Kill process and run again
npm run dev
```

---

## 📞 Contact

For environment variables or database access, contact the project owner.

**Happy Coding! 🚀**

