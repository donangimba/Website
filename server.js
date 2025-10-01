const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY_HERE');

const app = express();
app.use(cors());
app.use(express.json());

// Create Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: parseFloat(item.price.replace('€', '')) * 100, // Stripe uses cents
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4242, () => {
  console.log('Server running on port 4242');
});
