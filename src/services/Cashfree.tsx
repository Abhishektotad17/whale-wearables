import { load } from "@cashfreepayments/cashfree-js";

let cashfreeInstance : any = null;

export const initializeCashfree = async () => {
  if (!cashfreeInstance) {
    cashfreeInstance = await load({ mode: "sandbox" });
  }
  return cashfreeInstance;
};
