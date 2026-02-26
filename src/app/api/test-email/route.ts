import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export const maxDuration = 10;

export async function GET() {
  try {
    console.log('🧪 Starting SendGrid test...');
    
    // Check environment variables
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'SENDGRID_API_KEY not set' }, { status: 500 });
    }
    
    if (!fromEmail) {
      return NextResponse.json({ error: 'SENDGRID_FROM_EMAIL not set' }, { status: 500 });
    }
    
    console.log('✅ Environment variables present');
    console.log('📧 From:', fromEmail);
    console.log('🔑 API Key starts with:', apiKey.substring(0, 3));
    
    // Initialize SendGrid
    sgMail.setApiKey(apiKey);
    console.log('✅ SendGrid initialized');
    
    // Try to send a simple test email
    console.log('📤 Attempting to send test email...');
    
    const msg = {
      to: fromEmail, // Send to yourself for testing
      from: fromEmail,
      subject: 'SendGrid Test Email',
      text: 'This is a test email from your Vercel deployment.',
      html: '<p>This is a <strong>test email</strong> from your Vercel deployment.</p>',
    };
    
    console.log('🌐 Calling SendGrid API...');
    const startTime = Date.now();
    
    const response = await Promise.race([
      sgMail.send(msg),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout after 5 seconds')), 5000)
      )
    ]);
    
    const duration = Date.now() - startTime;
    console.log(`✅ Email sent successfully in ${duration}ms`);
    console.log('Response:', JSON.stringify(response));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      duration: `${duration}ms`,
      response 
    });
    
  } catch (error: any) {
    console.error('❌ SendGrid test error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.response) {
      console.error('SendGrid Response Status:', error.response.statusCode);
      console.error('SendGrid Response Body:', JSON.stringify(error.response.body));
    }
    
    return NextResponse.json({ 
      error: error.message,
      code: error.code,
      details: error.response?.body || null
    }, { status: 500 });
  }
}
