/* =====================================================================
   PAYMENTS — NOT IMPLEMENTED. There is no payment feature in this demo
   and no screen calls this file. It exists only to mark where Razorpay
   will be integrated.

   Rules for the real integration (see docs/PRODUCTION-ROADMAP.md):
   - Orders are created on the SERVER with the Razorpay secret key.
     The secret never appears in this front-end code.
   - The browser only opens Razorpay Checkout with the order id and the
     public key id returned by the server.
   - A payment is confirmed only after the server verifies the signature
     (and the payment.captured webhook), never from the browser alone.
   ===================================================================== */
const PaymentService={
  isAvailable(){return PAYANA_CONFIG.features.payments===true},
  async startCheckout(){notConnected('payments (Razorpay)')},
};
