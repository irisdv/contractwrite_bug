import { BN } from "bn.js";

export function isHexString(str: string): boolean {
  if (str === "") return true;
  return /^0x[0123456789abcdefABCDEF]+$/.test(str);
}

export function hexToDecimal(hex: string | undefined): string {
  if (hex === undefined) return "";
  else if (!isHexString(hex)) {
    throw new Error("Invalid hex string");
  }

  return new BN(hex.slice(2), 16).toString(10);
}
