import { isExpired } from "./utils";
import axios from "axios";

let authPayload: { token: string; expiry: number } | null = null;

export async function getAuthPayload() {
  if (!authPayload || isExpired(new Date(authPayload.expiry))) {
    authPayload = null;
    const url = "";
    const payload = {
      username: process.env.SERVICE_USERNAME,
      password: process.env.SERVICE_PASSWORD,
    };
    try {
      const response = await axios.post(url, payload);
      authPayload = response.data();
    } catch (error) {
      console.error("Error fetching auth payload: ", error);
    }
  }

  return authPayload;
}
