import express, { Request, Response } from "express";
import { Cart } from "./models/carts";
import { CustomRequest, CartItem } from "./types";
const cartRouter = express.Router();

// Get all items in the cart
cartRouter.get("/", async (req: CustomRequest, res: Response) => {
  console.log("Nobi say I no reach");
  const { uid: userId } = req.user;
  console.log("userId: ", userId);
  console.log("req.user: ", req.user);
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(201).json([]);
    }
    res.status(201).json(cart.cartItems);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: `Error fetching cart: ${error.message}` });
  }
});

// Add item to cart
cartRouter.post("/", async (req: CustomRequest, res: Response) => {
  const { uid: userId } = req.user;
  const newItem: CartItem = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      const newCart = new Cart({ userId, cartItems: [newItem] });
      const savedCart = await newCart.save();
      res.status(201).json(savedCart.cartItems[0]); // Return the new cart item with _id
    } else {
      cart.cartItems.push(newItem);
      const savedCart = await cart.save();
      res.status(200).json(savedCart.cartItems[savedCart.cartItems.length - 1]); // Return the new cart item with _id
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

    res.status(200).json(cart.cartItems[cartItemIndex]);
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

    const deletedItem = cart.cartItems[cartItemIndex];
    cart.cartItems.splice(cartItemIndex, 1);
    await cart.save();

    res.status(200).json(deletedItem);
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart item" });
  }
});

// Remove cart (useful on checkout)
cartRouter.delete("/", async (req: CustomRequest, res: Response) => {
  const { uid: userId } = req.user;

  try {
    await Cart.deleteOne({ userId });

    res.status(204).json({ message: "Cart was removed successfully" }); // Return a successful response with no content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove cart" }); // Return an error response
  }
});
export default cartRouter;
