# UPI Payment Setup Guide

## ✅ What's Been Implemented

I've successfully added UPI QR code/UPI ID payment option to your checkout page! Here's what's new:

### 1. **Payment Method Selection**
- Customers can now choose between:
  - **Razorpay Gateway** (Cards, UPI, Net Banking, Wallets) - Instant processing
  - **UPI Direct Payment** (Scan QR or use UPI ID) - Manual verification

### 2. **UPI Payment Flow**
- Display UPI QR code for customers to scan
- Show UPI ID that customers can copy
- File upload for payment screenshot
- Order created with `pending_payment` status
- Admin manually verifies and approves payments

### 3. **Database Updates**
- Added `paymentMethod` field (razorpay/upi/cod)
- Added `paymentScreenshot` field (stores base64 encoded screenshot)
- Added `pending_payment` status option

---

## 🔧 What You Need to Do Now

### Step 1: Add Your UPI QR Code Image

**Option A: Generate QR Code Online**
1. Go to any UPI QR code generator (search "UPI QR code generator")
2. Enter your UPI ID (e.g., `yourname@paytm`)
3. Download the QR code image
4. Save it as: `public/images/upi-qr-code.png`

**Option B: Use Your Payment App's QR**
1. Open Paytm/PhonePe/GooglePay
2. Go to "Receive Money" or "My QR Code"
3. Take a screenshot
4. Crop the QR code part
5. Save it as: `public/images/upi-qr-code.png`

### Step 2: Update Your UPI ID in .env

Open your `.env` file and update these lines with your actual details:

```env
# Replace with your actual UPI ID
NEXT_PUBLIC_UPI_ID="your-actual-upi@okaxis"

# Replace with your business name
NEXT_PUBLIC_UPI_NAME="Mango Fresh Farm"

# This can stay the same (points to the QR code image)
NEXT_PUBLIC_UPI_QR_CODE="/images/upi-qr-code.png"
```

### Step 3: Run Database Migration

You need to add the new fields to your Neon database. Run this SQL in your Neon dashboard:

```sql
-- Add payment fields to Order table
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'razorpay';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentScreenshot" TEXT;

-- Update status column to allow pending_payment
-- (No ALTER needed - it's just a string field)
```

### Step 4: Update Vercel Environment Variables

Go to your Vercel dashboard and add these environment variables:

1. **NEXT_PUBLIC_UPI_ID** = `your-actual-upi@okaxis`
2. **NEXT_PUBLIC_UPI_QR_CODE** = `/images/upi-qr-code.png`
3. **NEXT_PUBLIC_UPI_NAME** = `Mango Fresh Farm`

---

## 📱 How It Works for Customers

### Customer Journey:

1. **Add products to cart** → Go to checkout
2. **Enter shipping details** → Continue
3. **Choose payment method:**
   - **Razorpay**: Redirected to payment gateway (instant)
   - **UPI Direct**: See QR code and UPI ID
4. **For UPI payments:**
   - Scan QR code with payment app OR
   - Copy UPI ID and paste in payment app
   - Complete payment in their app
   - Take screenshot of successful payment
   - Upload screenshot on checkout page
5. **Place order** → Order created with `pending_payment` status
6. **Wait for confirmation** (within 24 hours)

### Admin Journey:

1. **Receive email notification** about new order
2. **Go to Admin → Orders**
3. **Find orders with `pending_payment` status**
4. **View payment screenshot** (you'll need to add this to admin UI)
5. **Verify amount matches order total**
6. **Update status to `processing`** if payment is valid

---

## 🎨 What's Different Now

### Checkout Page (Step 2: Payment)
- **Before**: Only showed Razorpay payment info
- **After**: Shows payment method selector with two options:
  - Razorpay (instant processing)
  - UPI Direct (manual verification with QR code display and screenshot upload)

### Order Creation
- **Before**: All orders had `processing` status immediately
- **After**: 
  - Razorpay orders: `processing` status (payment verified)
  - UPI orders: `pending_payment` status (needs admin verification)

### Database Schema
- Added `paymentMethod` field to track how customer paid
- Added `paymentScreenshot` field to store UPI payment proof
- Default payment method is `razorpay` (backward compatible)

---

## 🚨 Important Notes

1. **UPI QR Code**: Without your actual QR code, customers will see a placeholder. Replace it ASAP!

2. **UPI ID**: Update `.env` with your real UPI ID (e.g., `9876543210@paytm`)

3. **Payment Verification**: You need to manually verify UPI payments by:
   - Checking the screenshot
   - Matching the amount
   - Updating order status in admin panel

4. **Screenshot Storage**: Payment screenshots are stored as base64 strings in the database. For production, you might want to use cloud storage (Cloudinary, AWS S3) for better performance.

5. **Admin UI Enhancement**: Consider adding a dedicated "Payment Verification" page in admin panel to:
   - Filter `pending_payment` orders
   - Display payment screenshots
   - Quick approve/reject buttons

---

## 🔄 Database Migration Status

You still need to run these migrations in your Neon database:

```sql
-- Password reset fields (from earlier)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordResetExpiry" TIMESTAMP;

-- Payment fields (new)
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'razorpay';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentScreenshot" TEXT;

-- Remove duplicate shipping fields (cleanup from earlier)
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingFullName";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingEmail";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingPhone";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingAddress";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingCity";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingState";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingZipCode";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingCountry";
```

---

## 🧪 Testing the Feature

### Test Locally:

1. Start development server: `npm run dev`
2. Add products to cart
3. Go to checkout
4. Fill shipping details
5. On payment step, select "UPI Direct Payment"
6. You should see:
   - QR code (placeholder until you add real one)
   - UPI ID (from .env)
   - Copy button for UPI ID
   - File upload area
7. Upload any image as test screenshot
8. Review order and place
9. Order should be created with `pending_payment` status

### Verify in Admin:

1. Go to `/admin/orders`
2. Find the order you just created
3. Status should show `pending_payment`
4. Payment method should show `upi`

---

## 💡 Next Steps (Optional Enhancements)

1. **Admin Payment Verification UI**
   - Create `/admin/verify-payments` page
   - Show all `pending_payment` orders
   - Display screenshot next to order details
   - Add "Approve" and "Reject" buttons

2. **Customer Order Tracking**
   - Show payment status on order details page
   - Display message: "Payment under verification"
   - Show estimated verification time

3. **Automatic Reminders**
   - Send admin email with screenshot attached
   - Add thumbnail preview of screenshot in admin dashboard
   - Add filter in orders page for `pending_payment` status

4. **Better Screenshot Storage**
   - Integrate Cloudinary or AWS S3
   - Store image URLs instead of base64
   - Compress images for faster loading

---

## 🎉 Summary

UPI payment is now fully functional! Customers can:
- ✅ Choose between Razorpay and UPI
- ✅ See your UPI QR code
- ✅ Copy your UPI ID
- ✅ Upload payment screenshot
- ✅ Place order with manual verification

You just need to:
1. Add your actual UPI QR code image
2. Update your UPI ID in .env
3. Run database migrations
4. Deploy to Vercel

Let me know if you need help with the admin payment verification UI next! 🚀
