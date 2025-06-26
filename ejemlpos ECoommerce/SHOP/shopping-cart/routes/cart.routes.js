import { Router } from "express";
import { addToCart, removeFromCart, updateQuantity } from "../controllers/cart.controller.js";
const router = new Router();

// router.get('/', getCart);
router.post('/add', addToCart);
router.put('/remove', removeFromCart);
router.put('/update', updateQuantity);

export default router;
