import fs from "fs-extra";

export function getPackage() {
  if (!fs.existsSync("./package-lock.json")) {
    throw new Error(`Package file not found`);
  }
  return JSON.parse(fs.readFileSync("./package-lock.json", "utf-8"));
}