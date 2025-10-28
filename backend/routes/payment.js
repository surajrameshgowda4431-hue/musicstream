const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'inr', paymentMethod = 'card' } = req.body;

    const paymentIntentData = {
      amount: amount * 100, // Stripe expects amount in paise for INR
      currency: currency,
      metadata: {
        service: 'music_streaming_premium'
      }
    };

    // Add payment method types based on selection
    if (paymentMethod === 'upi') {
      paymentIntentData.payment_method_types = ['upi'];
    } else {
      paymentIntentData.payment_method_types = ['card'];
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Here you can update user's subscription status in your database
      res.json({ success: true, message: 'Payment successful!' });
    } else {
      res.json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;