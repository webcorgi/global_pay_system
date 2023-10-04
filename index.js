/*
  1. 보안 강화:

  HTTPS 사용: 애플리케이션을 HTTPS로 호스팅하여 데이터 전송 중에 보안을 유지하세요.
  API 키 보호: Stripe API 키를 환경 변수 또는 시크릿 관리 시스템에 저장하고, 민감한 데이터를 외부에 노출하지 않도록 합니다.
  2. 예외 처리 강화:

  에러 핸들링: Stripe API 호출 시 에러 핸들링을 추가하여 실패한 요청에 대한 적절한 응답을 제공하세요.
  데이터 유효성 검사: 사용자로부터 입력된 데이터를 검증하고, 필수 데이터가 누락되었거나 형식이 잘못된 경우 오류 메시지를 반환하세요.
  로그 기록: 중요한 이벤트 및 예외를 로그로 기록하여 문제를 식별하고 디버깅하세요.
  요청 제한: 일정한 요청 속도 제한을 설정하여 DDoS(분산 서비스 거부) 공격을 방지하세요.
  아래 코드 예제는 이러한 보안 및 예외 처리 원칙을 강화한 것입니다:
*/

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config()

const app = express()

app.use(express.json())

// 홈페이지
app.get('/', (req, res) => {
  res.send('Welcome to our subscription service!');
})

// 구독 생성 엔드포인트
app.post('/create-subscription', async (req, res) => {
  try {
    // 데이터 검증
    if (!req.body.email || !req.body.token) {
      throw new Error('Email and card token are required.')
    }

    // Stripe API 호출
    const customer = await stripe.customers.create({
      email: req.body.email,  // 사용자 이메일
      source: req.body.token, // 카드 토큰 (Stripe.js 또는 Stripe Elements로 생성)
    })

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: 'price_id' }], // Stripe 대시보드에서 생성한 가격 ID 사용
    })

    // 로그 기록
    console.log(`Subscription created: ${subscription.id}`)

    res.status(200).json({ subscription })
  } catch (error) {
    // 에러 핸들링
    console.error(error)
    res.status(500).json({ error: 'Subscription creation failed.' })
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})