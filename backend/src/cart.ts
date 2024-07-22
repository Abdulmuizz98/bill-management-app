import express, { Request, Response } from "express";
import { Cart } from "./models/carts";
import { CustomRequest, CartItem } from "./types";
const cartRouter = express.Router();

// Get all items in the cart
cartRouter.get("/", async (req: CustomRequest, res: Response) => {
  const { uId: userId } = req.user;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// Add item to cart
cartRouter.post("/", async (req: CustomRequest, res: Response) => {
  const { uId: userId } = req.user;
  const newItem: CartItem = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      const newCart = new Cart({ userId, cartItems: [newItem] });
      await newCart.save();
      res.status(201).json(newCart);
    } else {
      cart.cartItems.push(newItem);
      await cart.save();
      res.status(200).json(cart);
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding cart item" });
  }
});

// Update item in cart
cartRouter.put("/:cartItemId", async (req: CustomRequest, res: Response) => {
  const { cartItemId } = req.params;
  const { uid: userId } = req.user;
  const updateItem: CartItem = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItemIndex = cart.cartItems.findIndex(
      (item) => item._id!.toString() === cartItemId
    );

    if (cartItemIndex < 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    Object.assign(cart.cartItems[cartItemIndex], updateItem);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item" });
  }
});

// Remove item from cart
cartRouter.delete("/:cartItemId", async (req: CustomRequest, res: Response) => {
  const { cartItemId } = req.params;
  const { uid: userId } = req.user;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItemIndex = cart.cartItems.findIndex(
      (item) => item._id!.toString() === cartItemId
    );

    if (cartItemIndex < 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cart.cartItems.splice(cartItemIndex, 1);
    await cart.save();

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart item" });
  }
});

export default cartRouter;
