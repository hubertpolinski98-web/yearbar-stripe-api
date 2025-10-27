import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "YearBar Premium Access" },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
     success_url: "https://app.base44.com/hubertpolinski98-web/yearbar/premium",
cancel_url: "https://app.base44.com/hubertpolinski98-web/yearbar/life",
    });

    // ✅ send the checkout link back to the frontend
    res.json({ url: session.url });

  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ YearBar Stripe endpoint is running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
