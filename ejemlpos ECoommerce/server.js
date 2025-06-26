import express from 'express';
import expressProxy from 'express-http-proxy';

const app = express();

app.use('/user', expressProxy('http://user:3001'));
app.use('/products', expressProxy('http://product-service:3002'));
app.use('/cart', expressProxy('http://shopping-cart:3003'));
app.use('/orders', expressProxy('http://order-service:3004'));
app.use('/notification', expressProxy('http://notification-service:3005'));

app.listen(3000, () => {
  console.log(`Gateway running on http://localhost:3000`);
});
