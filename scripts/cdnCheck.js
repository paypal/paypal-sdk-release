import fetch from "node-fetch";
import { getPackage } from "./utils";

async function cdnCheck () {
  const version = getPackage().dependencies["@paypal/sdk-logos"].version;

  fetch(`https://www.paypalobjects.com/js-sdk-logos/${version}/ideal-black.svg`)
  .then((response) => {
    console.log(response.status);
    if (!(response.status >= 200 && response.status <= 300)) {
      throw new Error ("Error retreiving svg")
    }
  })
}

cdnCheck();