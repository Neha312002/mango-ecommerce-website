# 📧 Gmail SMTP Setup Guide (100% FREE)

Your website now uses **Gmail SMTP** instead of Resend - completely free email sending!

---

## ✅ **Step 1: Enable 2-Step Verification on Gmail**

1. Go to: **https://myaccount.google.com/security**
2. Sign in to your Gmail account
3. Scroll down to "**How you sign in to Google**"
4. Click on "**2-Step Verification**"
5. Click "**Get Started**" and follow the steps
6. Verify your phone number and complete setup

---

## 🔑 **Step 2: Generate App Password**

1. Go to: **https://myaccount.google.com/apppasswords**
   - Or: Google Account → Security → 2-Step Verification → App passwords (at bottom)

2. You'll see "**App passwords**" page

3. Under "**Select app**":
   - Click dropdown → Select "**Mail**"
   - Or type: "**Mango Fresh Farm**"

4. Under "**Select device**":
   - Click dropdown → Select "**Other (Custom name)**"
   - Type: "**Mango Ecommerce Website**"

5. Click "**Generate**"

6. You'll see a **16-character password** like: `abcd efgh ijkl mnop`

7. **COPY** this password (remove spaces): `abcdefghijklmnop`

---

## ⚙️ **Step 3: Update Vercel Environment Variables**

1. Go to: https://vercel.com/neha-s-projects-365fb191/mango-ecommerce-website/settings/environment-variables

2. **Add or Update these variables:**

### GMAIL_USER
- Name: `GMAIL_USER`
- Value: Your Gmail address (e.g., `your-email@gmail.com`)
- Environment: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

### GMAIL_APP_PASSWORD
- Name: `GMAIL_APP_PASSWORD`
- Value: The 16-character password you copied (with NO spaces)
- Environment: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

### ADMIN_EMAIL
- Name: `ADMIN_EMAIL`
- Value: `nehanischu@gmail.com` (or your preferred admin email)
- Environment: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

3. **Remove old variables** (optional but recommended):
   - Delete `RESEND_API_KEY`
   - Delete `EMAIL_FROM`

---

## 🚀 **Step 4: Redeploy**

1. Go to **Deployments** tab in Vercel
2. Click "**...**" menu on latest deployment
3. Select "**Redeploy**"
4. Wait for deployment to complete (~1-2 minutes)

---

## 🧪 **Step 5: Test Email Sending**

1. Visit: https://mango-ecommerce-website-ebon.vercel.app
2. Login to your account
3. Add items to cart
4. Go to checkout
5. Place a test order
6. **Check your email inbox!**

**Expected Results:**
- ✅ Customer receives order confirmation at their email
- ✅ Admin receives notification at `nehanischu@gmail.com`
- ✅ Emails sent from your Gmail account

---

## 📊 **Gmail SMTP Limits**

✅ **FREE Forever**
- **500 emails per day** (plenty for ecommerce)
- **Unlimited recipients**
- **No credit card required**

---

## 🔒 **Security Notes**

- ✅ App passwords are safer than using your actual Gmail password
- ✅ If compromised, you can revoke the app password at any time
- ✅ Your Gmail password remains secure
- ✅ You can create multiple app passwords for different apps

---

## 🆘 **Troubleshooting**

### "Invalid credentials" error
**Solution:** 
- Make sure 2-Step Verification is enabled
- Regenerate app password
- Check for spaces in the password (remove them)
- Update Vercel environment variables

### Emails not sending
**Solution:**
- Check Vercel Runtime Logs for errors
- Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set in Vercel
- Confirm you redeployed after adding variables

### Emails going to spam
**Solution:**
- This is normal for new senders
- Ask recipients to mark as "Not Spam"
- After a few emails, Gmail will trust your sender reputation

---

## 📧 **Email Templates**

Your website now sends:
1. **Order Confirmation** - Beautiful HTML email with order details
2. **Admin Notification** - Alert when new order placed
3. **Order Status Updates** - When order status changes
4. **Password Reset** - Secure password reset links (if implemented)

---

## 💰 **Cost Comparison**

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| **Gmail SMTP** | ✅ 500/day | FREE Forever |
| Resend | 3,000/month | $20+/month |
| SendGrid | 100/day | $15+/month |
| Mailgun | 5,000/month | $35+/month |

---

## ✅ **You're All Set!**

Your ecommerce website now has **professional email notifications** at **$0 cost**! 🎉

Happy selling! 🥭
