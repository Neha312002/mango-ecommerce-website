# 📧 SendGrid Setup Guide (100% FREE - 100 emails/day)

## ✅ Why SendGrid?
- **FREE forever** - 100 emails/day
- **API-based** - Works perfectly on Vercel (no SMTP blocking)
- **Professional** - High deliverability rates
- **No credit card required** for free tier

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create SendGrid Account

1. **Go to**: https://signup.sendgrid.com/
2. **Sign up** with your email (FREE)
3. **Verify** your email address
4. **Complete onboarding** (skip any upgrade prompts)

---

### Step 2: Create API Key

1. **Go to**: https://app.sendgrid.com/settings/api_keys
2. **Click**: "Create API Key" button
3. **Name**: `Mango Fresh Farm`
4. **Access**: Select "Full Access" (or "Restricted Access" → enable "Mail Send")
5. **Click**: "Create & View"
6. **COPY THE API KEY** (you'll only see it once!)
   - It looks like: `SG.xxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyy`

---

### Step 3: Verify Sender Email

**IMPORTANT**: SendGrid requires sender verification

1. **Go to**: https://app.sendgrid.com/settings/sender_auth/senders/new
2. **Click**: "Create New Sender"  
3. **Fill in**:
   - From Name: `Mango Fresh Farm`
   - From Email: `nehalpersonalmail@gmail.com` (or any email you own)
   - Reply To: Same as from email
   - Company Address: Your address
   - Nickname: `Mango Farm Sender`
4. **Click**: "Create"
5. **Check your email** and click verification link
6. **Wait for approval** (usually instant, sometimes takes 15 minutes)

---

### Step 4: Add to Vercel Environment Variables

1. **Go to**: https://vercel.com/neha-s-projects-365fb191/mango-ecommerce-website/settings/environment-variables

2. **Add Variable 1**:
   - Name: `SENDGRID_API_KEY`
   - Value: Your API key from Step 2 (starts with `SG.`)
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

3. **Add Variable 2**:
   - Name: `SENDGRID_FROM_EMAIL`
   - Value: The email you verified in Step 3 (e.g., `nehalpersonalmail@gmail.com`)
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

4. **Keep Existing**:
   - `ADMIN_EMAIL` = `nehanischu@gmail.com` (already set)

---

### Step 5: Redeploy on Vercel

1. **Go to**: https://vercel.com/neha-s-projects-365fb191/mango-ecommerce-website
2. **Click**: "Deployments" tab
3. **Click**: "..." menu on latest deployment
4. **Click**: "Redeploy"
5. **Wait**: ~1-2 minutes for green checkmark

---

### Step 6: Test!

1. **Visit**: Your website
2. **Place test order**
3. **Check**:
   - Customer email inbox (the email entered during checkout)
   - Admin inbox at `nehanischu@gmail.com`
4. **Verify**: Both emails received! 🎉

---

## 📊 Free Tier Limits

- **100 emails per day** (resets daily)
- **Unlimited recipients**
- **No expiration**
- **No credit card required**

Perfect for ecommerce sites with moderate order volume!

---

## 🎯 Email Flow

### When Order is Placed:

1. **Customer** receives:
   - From: `Mango Fresh Farm <nehalpersonalmail@gmail.com>`
   - Subject: `Order Confirmation - #MF1234567890123`
   - Beautiful HTML email with order details

2. **Admin** receives:
   - To: `nehanischu@gmail.com`
   - Subject: `🛎️ New Order #MF1234567890123 - ₹99.99`
   - Order summary with customer details

---

## 🔍 Troubleshooting

### "Sender not verified" error
**Solution**: Complete Step 3 and click the verification link in your email

### "Invalid API key" error
**Solution**: 
- Make sure you copied the FULL API key (starts with `SG.`)
- Regenerate key if needed
- Verify it's saved correctly in Vercel

### Emails going to spam
**Solution**:
- Ask recipients to mark as "Not Spam"
- SendGrid has excellent deliverability, this should be rare

### Still no emails after setup
**Solution**:
- Check Vercel Runtime Logs for errors
- Verify sender email is verified (green checkmark in SendGrid)
- Confirm API key has "Mail Send" permission

---

## ✅ You're All Set!

Your ecommerce website now has **professional email notifications** that work perfectly on Vercel! 🎉

**100 emails/day FREE forever** = Perfect for your mango farm business! 🥭
