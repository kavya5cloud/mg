
import { ShopOrder } from '../types';

/**
 * In a production environment, this would use a service like EmailJS, 
 * SendGrid, or a custom serverless function (AWS Lambda / Vercel).
 */
export const EmailService = {
  sendOrderConfirmation: async (order: ShopOrder) => {
    // Constructing the email payload
    const emailPayload = {
      to_email: order.email,
      to_name: order.customerName,
      subject: `Order Confirmed: ${order.id} - MOCA Gandhinagar`,
      message: `
        Dear ${order.customerName},
        
        Thank you for your purchase from MOCA Collectables. 
        Your order is being curated by our staff.
        
        Order ID: ${order.id}
        Total Amount: ₹${order.totalAmount.toLocaleString()}
        
        You can track your order status anytime at: 
        ${window.location.origin}/#/order-status
        
        Thank you for supporting MOCA Gandhinagar.
      `
    };

    // Simulate API Latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Logging for developer visibility in the prototype
    console.group('📧 Email Service Dispatch');
    console.log('Recipient:', emailPayload.to_email);
    console.log('Subject:', emailPayload.subject);
    console.log('Body:', emailPayload.message);
    console.groupEnd();

    return { success: true, message: 'Simulated email sent successfully' };
  }
};
