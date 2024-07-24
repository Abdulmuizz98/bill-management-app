import { isExpired } from "./utils";
import axios from "axios";

let authPayload: { token: string; expiry: number } | null = null;

export async function getAuthPayload() {
  if (!authPayload || isExpired(new Date(authPayload.expiry))) {
    authPayload = null;
    const BASE_URL = process.env.SERVICE_BASE_URL;
    const endpoint = `${BASE_URL}/api/auth`;
    const payload = {
      username: process.env.SERVICE_USERNAME,
      password: process.env.SERVICE_PASSWORD,
    };
    try {
      console.log("Trying to authenticate third party service...");
      const response = await axios.post(endpoint, payload);
      const data = await response.data;
      console.log("Successfully authenticated Service");
      authPayload = data;
    } catch (error) {
      console.error("Error fetching auth payload: ", error);
    }
  }

  return authPayload;
}
