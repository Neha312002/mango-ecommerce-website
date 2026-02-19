# 🚀 Production Setup Guide - Mango Fresh Farm

## Overview
This guide will help you configure Razorpay payments and email notifications for your production website.

---

## ✅ Completed Features

### UI/UX Improvements
- ✅ Back button added to login/auth page
- ✅ Add to Cart functionality working in wishlist page
- ✅ Product detail modal added to wishlist page (same as homepage)

### Payment Integration
- ✅ Razorpay SDK integrated
- ✅ Secure payment processing with signature verification
- ✅ Support for UPI, Cards, Net Banking, and Wallets
- ✅ Auto-capture payments
- ✅ Payment verification webhook

### Email Notifications
- ✅ Resend email service integrated
- ✅ Order confirmation emails with beautiful HTML templates
- ✅ Order details, items, and shipping info included

---

## 🔧 Required Configuration

### 1. Environment Variables Setup

Your `.env.local` file has been created. Update it with your actual credentials:

#### Database (Already configured)
```env
DATABASE_URL="your-neon-postgres-connection-string"
```

#### JWT Secret
Generate a secure random string:
```bash
# On Windows PowerShell:
-join ((65..90) + (97..122) + (48..57) + (33..47) | Get-Random -Count 32 | % {[char]$_})
```
Replace `your-secret-key-here-change-this-in-production` with the generated string.

---

### 2. Razorpay Configuration

#### Step 1: Create Razorpay Account
1. Go to [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
2. Sign up with your business email
3. Complete KYC verification (required for live mode)

#### Step 2: Get API Keys

**For Testing (Test Mode):**
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Switch to **Test Mode** (toggle on left sidebar)
3. Go to **Settings** → **API Keys**
4. Click **Generate Test Key**
5. Copy both:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret**

**For Production (Live Mode):**
1. Complete KYC verification
2. Switch to **Live Mode**
3. Go to **Settings** → **API Keys**
4. Click **Generate Live Key**
5. Copy both:
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret**

#### Step 3: Update .env.local
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_XXXXXXXXXXXXXXXX"  # or rzp_live_
RAZORPAY_KEY_SECRET="YOUR_KEY_SECRET_HERE"
```

#### Step 4: Test Payment
Use these test card details in **Test Mode**:
- **Card Number:** 4111 1111 1111 1111
- **Expiry:** Any future date (e.g., 12/25)
- **CVV:** Any 3 digits (e.g., 123)
- **Name:** Any name

**Test UPI IDs:**
- Success: `success@razorpay`
- Failure: `failure@razorpay`

#### Step 5: Configure Webhooks (Optional but Recommended)
1. Go to **Settings** → **Webhooks** in Razorpay Dashboard
2. Click **Create New Webhook**
3. URL: `https://yourdomain.com/api/razorpay/webhook`
4. Select events:
   - `payment.captured`
   - `payment.failed`
5. Save the **Webhook Secret**

---

### 3. Email (Resend) Configuration

#### Step 1: Create Resend Account
1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Sign up with your email
3. Verify your email address

#### Step 2: Get API Key
1. Login to [Resend Dashboard](https://resend.com/api-keys)
2. Click **Create API Key**
3. Name it (e.g., "Mango Fresh Farm Production")
4. Select permissions: **Sending access**
5. Copy the API key (starts with `re_`)

#### Step 3: Verify Domain (Important for Production)
**For testing, you can skip this and use the default sender.**

For production emails from your domain:
1. Go to [Domains](https://resend.com/domains) in Resend
2. Click **Add Domain**
3. Enter your domain (e.g., `mangofreshfarm.com`)
4. Add the DNS records shown to your domain provider:
   - **TXT Record** for SPF
   - **CNAME Records** for DKIM
5. Wait for verification (usually 5-30 minutes)

#### Step 4: Update .env.local
```env
RESEND_API_KEY="re_XXXXXXXXXXXXXXXXXXXXXXXX"
EMAIL_FROM="orders@yourdomain.com"  # Use verified domain
# Or for testing: "noreply@resend.dev"
```

#### Step 5: Test Email
Place a test order and check if you receive the confirmation email.

---

### 4. Vercel Deployment

#### Step 1: Add Environment Variables to Vercel
1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable from `.env.local`:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`

**Important:** 
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Other variables are server-side only (more secure)

#### Step 2: Deploy
```bash
git add .
git commit -m "Add Razorpay and email integration"
git push
```

Vercel will auto-deploy. Monitor the deployment logs for any errors.

---

## 🧪 Testing Checklist

### Payment Flow
- [ ] Navigate to checkout
- [ ] Complete shipping information
- [ ] Click "Place Order"
- [ ] Razorpay modal opens
- [ ] Complete payment with test credentials
- [ ] Order confirmation page shows
- [ ] Order appears in "My Account"

### Email Flow
- [ ] Place an order
- [ ] Check email inbox (including spam folder)
- [ ] Verify order confirmation email received
- [ ] Email shows correct order details
- [ ] Email formatting looks professional

### Edge Cases
- [ ] Test payment cancellation (close Razorpay modal)
- [ ] Test payment failure with test failure credentials
- [ ] Test with empty cart (should redirect)
- [ ] Test without login (should redirect to auth)

---

## 🔒 Security Best Practices

1. **Never commit .env.local to Git**
   - Already in `.gitignore` ✅

2. **Use different keys for test and live**
   - Test keys for development
   - Live keys only in production Vercel

3. **Verify Razorpay signatures**
   - Already implemented ✅

4. **Keep JWT_SECRET complex and secret**
   - Minimum 32 characters
   - Mix of letters, numbers, symbols

5. **Enable HTTPS only**
   - Vercel provides this automatically ✅

---

## 📊 Monitoring & Analytics

### Razorpay Dashboard
- Monitor transactions: [https://dashboard.razorpay.com/app/payments](https://dashboard.razorpay.com/app/payments)
- View settlements
- Download reports
- Refund payments if needed

### Resend Dashboard
- Monitor email delivery: [https://resend.com/emails](https://resend.com/emails)
- Check delivery rates
- View bounce/complaint rates
- Manage blocked addresses

---

## 🐛 Troubleshooting

### Razorpay Issues

**"Invalid key_id provided"**
- Check `NEXT_PUBLIC_RAZORPAY_KEY_ID` in Vercel environment variables
- Ensure no extra spaces or quotes
- Verify key is for correct mode (test/live)

**Payment succeeds but order not created**
- Check Vercel function logs
- Verify database connection
- Check items in cart have valid product IDs

**Razorpay modal doesn't open**
- Check browser console for errors
- Ensure Razorpay script loaded (check Network tab)
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set

### Email Issues

**Email not received**
- Check spam/junk folder
- Verify `RESEND_API_KEY` in environment variables
- Check Resend dashboard for delivery status
- Verify `EMAIL_FROM` is correct format

**"Domain not verified"**
- Use `noreply@resend.dev` for testing
- Or complete domain verification in Resend

**Email shows wrong content**
- Order data should include customer name, items, total
- Check order creation API logs

---

## 🎯 Next Steps for Full Production

### Priority 1 (Essential)
1. **Set up Razorpay Live Mode**
   - Complete KYC verification
   - Switch to live keys
   - Test with small real transaction

2. **Verify domain for emails**
   - Professional appearance
   - Better deliverability

3. **Add legal pages**
   - Privacy Policy
   - Terms of Service
   - Refund/Return Policy
   - Shipping Policy

### Priority 2 (Important)
4. **Admin Panel**
   - View orders
   - Update order status
   - Manage products
   - View analytics

5. **Add more email notifications**
   - Order shipped
   - Order delivered
   - Password reset

6. **Implement search and filters**
   - Search products
   - Filter by price
   - Sort options

### Priority 3 (Enhancement)
7. **Add analytics**
   - Google Analytics
   - Vercel Analytics

8. **Optimize performance**
   - Image optimization
   - Lazy loading
   - Database indexes

9. **Add customer features**
   - Order cancellation
   - Discount coupons
   - Refer a friend

---

## 📞 Support Resources

### Razorpay
- Documentation: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- Support: [https://razorpay.com/support/](https://razorpay.com/support/)
- Test Cards: [https://razorpay.com/docs/payments/payments/test-card-details/](https://razorpay.com/docs/payments/payments/test-card-details/)

### Resend
- Documentation: [https://resend.com/docs](https://resend.com/docs)
- API Reference: [https://resend.com/docs/api-reference](https://resend.com/docs/api-reference)
- Support: [hello@resend.com](mailto:hello@resend.com)

### Vercel
- Documentation: [https://vercel.com/docs](https://vercel.com/docs)
- Environment Variables: [https://vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)

---

## ✨ What's Been Implemented

### 🎨 UI/UX
- Homepage with product carousel and hero slider
- Product detail modals (homepage & wishlist)
- Shopping cart with flying mango animation
- 3-step checkout flow
- User account dashboard
- Wishlist functionality
- Order tracking
- Review system

### 💳 Payment
- Razorpay integration (UPI, Cards, Net Banking, Wallets)
- Payment verification
- Secure signature validation
- Auto-capture payments

### 📧 Email
- Order confirmation emails
- Beautiful HTML templates
- Order details and tracking info

### 🔐 Security
- JWT authentication
- Password hashing (bcrypt)
- Payment signature verification
- Environment variables for secrets

### 💾 Database
- User management
- Product catalog
- Order management
- Reviews
- Wishlist
- Addresses

---

**Your e-commerce website is now production-ready!** 🎉

Configure the environment variables as described above, test thoroughly, and you're good to go live!
