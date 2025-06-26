import Cart from "../models/Cart.js";

export async function create(id) {
  try {
    const cart = await Cart.create({
      user: id,
    });
    return cart;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function addToCart(req, res) {
  try {
    const { id, quantity = 1 } = req.body;
    const user = req.user.user;
    let userCart = await Cart.findOne({ user: user._id });
    if (!userCart) {
      userCart = create(user._id);
    }
    const product = {
      productId: id,
      quantity,
    };
    if (!userCart.products) {
      userCart.products = [];
    }
    userCart.products.push(product);
    await userCart.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
}

export async function removeFromCart(req, res) {
  try {
    const { id } = req.body;
    const user = req.user.user;
    let userCart = await Cart.findOne({ user: user._id });
    userCart.products = userCart.products.filter(product => product.id === id);
    // console.log(userCart.products.filter(product => product.id === id))
    await userCart.save();
    return res.status(200).json(userCart);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
}

export async function updateQuantity(req, res) {
  try {
    const { id, quantity } = req.body;
    const user = req.user.user;
    let userCart = await Cart.findOne({ user: user._id });
    const itemIndex = userCart.products.findIndex(
      (product) => product.productId === id
    );
    if (itemIndex > -1) {
      userCart.products[itemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ msg: "Product not found in cart" });
    }
    await userCart.save();
    return res.status(200).json(userCart);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
}
