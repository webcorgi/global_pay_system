const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config()

const app = express();

app.use(express.json());
/*
    이 코드에서는 Express 프레임워크를 사용하고, /create-subscription 엔드포인트를 통해 구독을 생성합니다.
    구독을 생성하기 위해 사용자의 이메일과 카드 토큰을 받아 Stripe API를 호출합니다.
    price_id는 Stripe 대시보드에서 생성한 구독 가격 ID로 교체해야 합니다.
    실제 환경에서는 보안과 예외 처리를 강화해야 합니다.
*/
// 홈 페이지
app.get('/', (req, res) => {
  res.send('Welcome to our subscription service!');
});

// 구독 생성 엔드포인트
app.post('/create-subscription', async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      email: req.body.email, // 사용자 이메일
      source: req.body.token, // 카드 토큰 (Stripe.js 또는 Stripe Elements로 생성)
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: 'price_id' }], // Stripe 대시보드에서 생성한 가격 ID 사용
    });

    res.status(200).json({ subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Subscription creation failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
