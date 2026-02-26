# 🚀 Quick Setup for New Developer

Welcome! This guide will help you set up the project on your machine quickly.

---

## ✅ Step-by-Step Setup

### Step 1: Install Prerequisites

1. **Node.js** (v20.9.0+): https://nodejs.org/
2. **Git**: https://git-scm.com/
3. **VS Code** (recommended): https://code.visualstudio.com/

Verify installations:
```bash
node --version  # Should show v20.9.0 or higher
git --version
```

### Step 2: Clone & Install

```bash
# Clone the repository
git clone https://github.com/Neha312002/mango-ecommerce-website.git
cd mango-ecommerce-website

# Install dependencies (takes 2-3 minutes)
npm install
```

### Step 3: Get Environment Variables

**Ask the project owner** for the `.env` file content and create it in the root folder:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."
RESEND_API_KEY="..."
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

### Step 5: Run the Project

```bash
npm run dev
```

Open http://localhost:3000 - You should see the site! 🎉

---

##  🔐 Get Admin Access

1. Register at: http://localhost:3000/auth
2. Ask owner to run this SQL in Neon:
   ```sql
   UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
   ```
3. Logout and login again
4. Admin button appears in navbar → Access admin panel at `/admin`

---

## 📚 Understanding the Project

### Tech Stack
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: PostgreSQL (Neon Cloud)
- **Auth**: JWT + Bcrypt
- **Payment**: Razorpay
- **Email**: Resend

### Folder Structure

```
src/app/
├── api/              ← Backend API endpoints
│   ├── auth/         ← Login, register, password reset
│   ├── products/     ← Product CRUD
│   ├── orders/       ← Order management
│   └── users/        ← User endpoints
├── admin/            ← Admin panel pages
│   ├── products/     ← Product management UI
│   ├── orders/       ← Order management UI
│   └── users/        ← User management UI
├── auth/             ← Login/Register page
├── checkout/         ← Checkout flow
├── forgot-password/  ← Password reset request
├── reset-password/   ← Password reset with token
├── account/          ← User account dashboard
├── wishlist/         ← Wishlist page
└── context/
    └── CartContext.tsx ← Shopping cart state
```

### Key Files to Know

- `prisma/schema.prisma` - Database schema
- `src/app/api/` - All backend logic
- `src/app/admin/` - Admin UI
- `src/context/CartContext.tsx` - Shopping cart state
- `.env` - Environment variables (never commit this!)

---

## 🛠️ Common Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Check code quality
npx prisma studio # Open database GUI
```

---

## 🧪 Test Your Setup

1. **Homepage**: http://localhost:3000 - Should show products
2. **Login**: http://localhost:3000/auth - Register/login
3. **Cart**: Add products to cart
4. **Wishlist**: Add products to wishlist
5. **Admin**: Get admin access and visit `/admin`

---

## 🆘 Common Issues

**"Cannot find module"**
```bash
rm -rf node_modules
npm install
```

**"Prisma Client not found"**
```bash
npx prisma generate
```

**"Database connection failed"**
- Check `.env` file exists
- Verify `DATABASE_URL` is correct
- Ask owner to confirm database access

**TypeScript errors everywhere**
- Restart VS Code
- Or: Ctrl+Shift+P → "TypeScript: Restart TS Server"

---

## 💡 Development Tips

### VS Code Extensions (Recommended)
- ESLint
- Prisma
- Tailwind CSS IntelliSense
- GitLens

### Git Workflow
```bash
git pull origin master              # Get latest changes
git checkout -b feature/your-name   # Create feature branch
# ... make changes ...
git add .
git commit -m "Your changes"
git push origin feature/your-name   # Push to GitHub
# Create Pull Request on GitHub
```

### Hot Reload
- Save any file → Browser auto-refreshes
- No need to restart server for most changes

### Database Changes
- **Don't** run Prisma migrations locally
- Database is on Neon cloud (not local)
- Schema changes require SQL queries
- Ask owner for SQL migration queries

---

## 📝 What to Work On

### Your First Task Ideas

1. **Explore**: Browse the codebase, understand structure
2. **Small Fix**: Fix a typo or improve text
3. **Feature**: Ask owner what to work on

### Areas of the Site

- **Customer Side**: Homepage, products, cart, checkout, account
- **Admin Side**: Dashboard, product management, order management
- **Auth**: Login, register, forgot password
- **API**: All backend endpoints in `src/app/api/`

---

## 📖 Learn More

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 📞 Need Help?

- **Read README.md** - Full project documentation
- **Ask Owner** - For env variables, database access, SQL queries
- **GitHub Issues** - Check existing issues or create new one
- **Team Chat** - Ask in Slack/Discord

---

**You're all set! Happy coding! 🥭🚀**
