import nodemailer from 'nodemailer';

// Create Gmail SMTP transporter
function createTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Gmail credentials not configured');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderData: {
    orderNumber: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: {
      fullName: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  }
) {
  try {
    // Check if email is configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('⚠️ Gmail credentials not configured, skipping email');
      return { success: false, error: 'Email not configured' };
    }

    console.log('📧 Sending order confirmation email to:', to);
    console.log('📦 Order number:', orderData.orderNumber);

    // Initialize Gmail transporter
    const transporter = createTransporter();
    console.log('✅ Gmail transporter initialized');
    console.log('📧 SMTP Config: smtp.gmail.com:465 (SSL)');

    const itemsHtml = orderData.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            ${item.name} × ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ₹${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #FF8C42 0%, #3D4F42 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🥭 Mango Fresh Farm</h1>
                      <p style="margin: 10px 0 0; color: #ffffff; font-size: 18px;">Order Confirmation</p>
                    </td>
                  </tr>
                  
                  <!-- Order Details -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px; color: #3D4F42; font-size: 24px;">Thank you for your order!</h2>
                      <p style="margin: 0 0 10px; color: #4b5563; font-size: 16px;">
                        Hi ${orderData.customerName},
                      </p>
                      <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px;">
                        Your order has been confirmed and will be shipped soon. Here are your order details:
                      </p>
                      
                      <div style="background-color: #FFF7ED; border-left: 4px solid #FF8C42; padding: 15px; margin-bottom: 30px;">
                        <p style="margin: 0; color: #3D4F42; font-size: 14px; font-weight: 600;">Order Number</p>
                        <p style="margin: 5px 0 0; color: #FF8C42; font-size: 20px; font-weight: 700;">#${orderData.orderNumber}</p>
                      </div>
                      
                      <!-- Items Table -->
                      <h3 style="margin: 30px 0 15px; color: #3D4F42; font-size: 18px;">Order Items</h3>
                      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                          <tr>
                            <th style="padding: 12px; border-bottom: 2px solid #3D4F42; text-align: left; color: #3D4F42; font-size: 14px;">Item</th>
                            <th style="padding: 12px; border-bottom: 2px solid #3D4F42; text-align: right; color: #3D4F42; font-size: 14px;">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsHtml}
                        </tbody>
                      </table>
                      
                      <!-- Totals -->
                      <table style="width: 100%; margin-top: 20px;">
                        <tr>
                          <td style="padding: 8px 0; color: #4b5563;">Subtotal:</td>
                          <td style="padding: 8px 0; text-align: right; color: #4b5563;">₹${orderData.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #4b5563;">Shipping:</td>
                          <td style="padding: 8px 0; text-align: right; color: #4b5563;">
                            ${orderData.shipping === 0 ? 'FREE' : `₹${orderData.shipping.toFixed(2)}`}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #4b5563;">Tax:</td>
                          <td style="padding: 8px 0; text-align: right; color: #4b5563;">₹${orderData.tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; border-top: 2px solid #e5e7eb; color: #3D4F42; font-weight: 700; font-size: 18px;">Total:</td>
                          <td style="padding: 8px 0; border-top: 2px solid #e5e7eb; text-align: right; color: #FF8C42; font-weight: 700; font-size: 18px;">₹${orderData.total.toFixed(2)}</td>
                        </tr>
                      </table>
                      
                      <!-- Shipping Address -->
                      <h3 style="margin: 30px 0 15px; color: #3D4F42; font-size: 18px;">Shipping Address</h3>
                      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px;">
                        <p style="margin: 0 0 5px; color: #3D4F42; font-weight: 600;">${orderData.shippingAddress.fullName}</p>
                        <p style="margin: 0 0 5px; color: #4b5563;">${orderData.shippingAddress.address}</p>
                        <p style="margin: 0; color: #4b5563;">
                          ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}
                        </p>
                        <p style="margin: 5px 0 0; color: #4b5563;">${orderData.shippingAddress.country}</p>
                      </div>
                      
                      <!-- Track Order Button -->
                      <div style="text-align: center; margin-top: 40px;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/track-order" 
                           style="display: inline-block; background-color: #FF8C42; color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          Track Your Order
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                        Questions? Contact us at <a href="mailto:support@mangofreshfarm.com" style="color: #FF8C42; text-decoration: none;">support@mangofreshfarm.com</a>
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        © ${new Date().getFullYear()} Mango Fresh Farm. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    console.log('📤 Attempting to send email...');
    console.log('From:', process.env.GMAIL_USER);
    console.log('To:', to);
    
    const info = await transporter.sendMail({
      from: `"Mango Fresh Farm" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: `Order Confirmation - #${orderData.orderNumber}`,
      html: htmlContent,
    });

    console.log('✅ Email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📨 Response:', info.response);
    return { success: true, data: info };
  } catch (error: any) {
    console.error('❌ Email sending error (catch block):', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    return { success: false, error: error.message };
  }
}

// Send admin notification when new order is placed
export async function sendAdminOrderNotification(orderData: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.ADMIN_EMAIL) {
      console.warn('⚠️ Email not configured for admin notifications');
      console.warn('GMAIL_USER exists:', !!process.env.GMAIL_USER);
      console.warn('GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD);
      console.warn('ADMIN_EMAIL exists:', !!process.env.ADMIN_EMAIL);
      return { success: false, error: 'Email not configured' };
    }

    console.log('📧 Sending admin notification to:', process.env.ADMIN_EMAIL);
    console.log('📦 Order:', orderData.orderNumber, '- Total:', orderData.total);

    const transporter = createTransporter();

    const itemsHtml = orderData.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            ${item.name}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ₹${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Order Received</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🛎️ New Order Alert</h1>
                      <p style="margin: 10px 0 0; color: #ffffff; font-size: 18px;">Admin Notification</p>
                    </td>
                  </tr>
                  
                  <!-- Order Details -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px; color: #3D4F42; font-size: 24px;">New Order Received!</h2>
                      
                      <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin-bottom: 30px;">
                        <p style="margin: 0; color: #3D4F42; font-size: 14px; font-weight: 600;">Order Number</p>
                        <p style="margin: 5px 0 0; color: #F59E0B; font-size: 20px; font-weight: 700;">#${orderData.orderNumber}</p>
                      </div>
                      
                      <!-- Customer Info -->
                      <h3 style="margin: 30px 0 15px; color: #3D4F42; font-size: 18px;">Customer Information</h3>
                      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <p style="margin: 0 0 5px; color: #3D4F42; font-weight: 600;">${orderData.customerName}</p>
                        <p style="margin: 0 0 5px; color: #4b5563;">📧 ${orderData.customerEmail}</p>
                        <p style="margin: 5px 0 0; color: #4b5563; font-size: 14px;">
                          📍 ${orderData.shippingAddress.address}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}
                        </p>
                      </div>
                      
                      <!-- Items Table -->
                      <h3 style="margin: 30px 0 15px; color: #3D4F42; font-size: 18px;">Order Items</h3>
                      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                          <tr>
                            <th style="padding: 12px; border-bottom: 2px solid #3D4F42; text-align: left; color: #3D4F42; font-size: 14px;">Product</th>
                            <th style="padding: 12px; border-bottom: 2px solid #3D4F42; text-align: center; color: #3D4F42; font-size: 14px;">Qty</th>
                            <th style="padding: 12px; border-bottom: 2px solid #3D4F42; text-align: right; color: #3D4F42; font-size: 14px;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsHtml}
                        </tbody>
                      </table>
                      
                      <!-- Order Total -->
                      <div style="background-color: #DBEAFE; padding: 20px; border-radius: 6px; text-align: center;">
                        <p style="margin: 0 0 5px; color: #1E40AF; font-size: 14px; font-weight: 600;">Order Total</p>
                        <p style="margin: 0; color: #1E40AF; font-size: 32px; font-weight: 700;">₹${orderData.total.toFixed(2)}</p>
                      </div>
                      
                      <!-- Action Button -->
                      <div style="text-align: center; margin-top: 40px;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/admin/orders" 
                           style="display: inline-block; background-color: #8B5CF6; color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          View in Admin Panel
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        This is an automated admin notification from Mango Fresh Farm
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    console.log('📤 Attempting to send admin email...');
    console.log('From:', process.env.GMAIL_USER);
    console.log('To:', process.env.ADMIN_EMAIL);

    const info = await transporter.sendMail({
      from: `"Mango Fresh Farm" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🛎️ New Order #${orderData.orderNumber} - ₹${orderData.total.toFixed(2)}`,
      html: htmlContent,
    });

    console.log('✅ Admin email sent successfully!');
    console.log('📨 Admin message ID:', info.messageId);
    console.log('📨 Admin response:', info.response);
    return { success: true, data: info };
  } catch (error: any) {
    console.error('❌ Admin email sending error (catch block):', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    return { success: false, error: error.message };
  }
}

// Send order status update notification to customer
export async function sendOrderStatusUpdateEmail(
  to: string,
  orderData: {
    orderNumber: string;
    customerName: string;
    status: string;
    statusMessage: string;
    items: Array<{ name: string; quantity: number }>;
    trackingUrl?: string;
  }
) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('Gmail credentials not configured, skipping email');
      return { success: false, error: 'Email not configured' };
    }

    const transporter = createTransporter();

    const statusColors: { [key: string]: { bg: string; text: string; emoji: string } } = {
      processing: { bg: '#FEF3C7', text: '#F59E0B', emoji: '⏳' },
      shipped: { bg: '#DBEAFE', text: '#2563EB', emoji: '🚚' },
      delivered: { bg: '#D1FAE5', text: '#059669', emoji: '✅' },
      cancelled: { bg: '#FEE2E2', text: '#DC2626', emoji: '❌' },
    };

    const statusStyle = statusColors[orderData.status.toLowerCase()] || statusColors.processing;

    const itemsHtml = orderData.items
      .map(
        (item) => `
        <li style="padding: 8px 0; color: #4b5563; font-size: 15px;">
          ${item.name} × ${item.quantity}
        </li>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Status Update</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #FF8C42 0%, #3D4F42 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🥭 Mango Fresh Farm</h1>
                      <p style="margin: 10px 0 0; color: #ffffff; font-size: 18px;">Order Status Update</p>
                    </td>
                  </tr>
                  
                  <!-- Status Update -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px; color: #3D4F42; font-size: 24px;">Hi ${orderData.customerName}!</h2>
                      <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px;">
                        Your order status has been updated.
                      </p>
                      
                      <!-- Status Badge -->
                      <div style="background-color: ${statusStyle.bg}; border-left: 4px solid ${statusStyle.text}; padding: 20px; margin-bottom: 30px; border-radius: 6px;">
                        <p style="margin: 0 0 5px; color: #3D4F42; font-size: 14px; font-weight: 600;">Order Number</p>
                        <p style="margin: 0 0 15px; color: ${statusStyle.text}; font-size: 20px; font-weight: 700;">#${orderData.orderNumber}</p>
                        <p style="margin: 0; color: #3D4F42; font-size: 14px; font-weight: 600;">Status</p>
                        <p style="margin: 5px 0 0; color: ${statusStyle.text}; font-size: 24px; font-weight: 700;">
                          ${statusStyle.emoji} ${orderData.status.toUpperCase()}
                        </p>
                      </div>
                      
                      <!-- Status Message -->
                      <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                        <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          ${orderData.statusMessage}
                        </p>
                      </div>
                      
                      <!-- Order Items -->
                      <h3 style="margin: 30px 0 15px; color: #3D4F42; font-size: 18px;">Order Items</h3>
                      <ul style="list-style: none; padding: 0; margin: 0 0 30px 0;">
                        ${itemsHtml}
                      </ul>
                      
                      ${
                        orderData.trackingUrl
                          ? `
                      <!-- Track Button -->
                      <div style="text-align: center; margin-top: 40px;">
                        <a href="${orderData.trackingUrl}" 
                           style="display: inline-block; background-color: #FF8C42; color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          Track Your Order
                        </a>
                      </div>
                      `
                          : ''
                      }
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                        Questions? Contact us at <a href="mailto:support@mangofreshfarm.com" style="color: #FF8C42; text-decoration: none;">support@mangofreshfarm.com</a>
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        © ${new Date().getFullYear()} Mango Fresh Farm. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"Mango Fresh Farm" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: `Order #${orderData.orderNumber} - ${statusStyle.emoji} ${orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}`,
      html: htmlContent,
    });

    console.log('✅ Status update email sent successfully!');
    return { success: true, data: info };
  } catch (error: any) {
    console.error('Status update email error:', error);
    return { success: false, error: error.message };
  }
}
