import fetch from "node-fetch";
import { dependencies } from "../package-lock.json";

async function cdnCheck() {
  const version = dependencies["@paypal/sdk-logos"].version;
  console.log(`Paypal SDK Logos v${version} installed`);

  const url = `https://www.paypalobjects.com/js-sdk-logos/${version}/paypal-default.svg`;
  console.log(`Attempting to fetch ${url}`);
  await fetch(url).then((response) => {
    console.log(`Response status: ${response.status}`);
    if (!(response.status >= 200 && response.status < 300)) {
      throw new Error("Error retreiving svg");
    }
  });
}

cdnCheck();
