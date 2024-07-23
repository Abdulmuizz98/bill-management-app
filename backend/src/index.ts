import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response, NextFunction } from "express";
import { firebase as admin } from "./lib/firebase";
import { getAuthPayload } from "./auth";
import cors from "cors";
import bodyParser from "body-parser";
import billsRouter from "./bills";
import cartRouter from "./cart";
import { CustomRequest } from "./types";

const app: Express = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: "*",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
// Middleware to verify Firebase ID token and fetch user profile
async function authenticateUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  console.log("Tried to authenticate...");

  // Check if user is an authenticated user or not. If authenticated validate auth token.
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const idToken = req.headers["authorization"]?.split("Bearer ")[1];

    if (!idToken) {
      return res.status(401).json({
        error:
          "Unauthorized: Authorization header with Bearer token is required",
      });
    }

    try {
      let userProfile = null;
      // Verify Firebase ID token; then fetch user profile
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      userProfile = await admin.auth().getUser(decodedToken.uid);

      req.user = userProfile; // Attach full user profile to request object

      next();
    } catch (error) {
      return res.status(403).json({ error: "Forbidden: Invalid token key" });
    }
  }
}

// Middleware to ensure that we have a valid token and currently authenticated to third-party service
async function ensureServiceAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("got here first");
  const payload = await getAuthPayload();
  console.log("got here first");

  if (!payload)
    return res.status(403).json({
      error: "Unavailable: Service Temporarily Unavailable. Please try again.",
    });

  // Add the token to the request headers
  req.headers["authorization"] = `Bearer ${payload.token}`;
  next();
}

// Plugin other routers
app.use("/bills", ensureServiceAuthenticated, billsRouter);
app.use("/cart", authenticateUser, cartRouter);

app.get("/status", (req: Request, res: Response) => {
  res.status(200).json({ status: "Server is up and running" });
});

// Handle requests to unknown paths
app.use((req: Request, res: Response) => {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
