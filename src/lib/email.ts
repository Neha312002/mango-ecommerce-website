import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Mango Fresh Farm <onboarding@resend.dev>',
      to: [to],
      subject: `Order Confirmation - #${orderData.orderNumber}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}
