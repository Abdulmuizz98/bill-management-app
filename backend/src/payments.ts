import axios from "axios";
const PS_SECRET_KEY = process.env.PS_SECRET_KEY;

export async function verifyPayStack(
  reference: string,
  amountToVerify: number
) {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PS_SECRET_KEY}`,
        },
      }
    );
    const { data, message } = response.data;
    const { status, amount: paidAmount } = data;

    if (
      status &&
      paidAmount === amountToVerify * 100 &&
      message === "Verification successful"
    ) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("[Verifying paystack payment]: ", error);
    return false;
  }
}
