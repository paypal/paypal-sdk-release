import fetch from "node-fetch";
import { dependencies } from "../package-lock.json";

async function cdnCheck () {
  const version = dependencies["@paypal/sdk-logos"].version;
console.log(version);
  await fetch(`https://www.paypalobjects.com/js-sdk-logos/${version}/paypal-default.svg`)
  .then((response) => {
    console.log(response.status);
    if (!(response.status >= 200 && response.status < 300)) {
      throw new Error ("Error retreiving svg")
    }
  })
}

cdnCheck();