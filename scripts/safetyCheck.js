import fetch from "node-fetch";

async function safetyCheck () {
  fetch('https://cdnx-api.qa.paypal.com/assets/verify/js-sdk-release/', {
    method: 'GET',
    headers: {
      "Accept": "application/json",
      "Accept-Language": "en_US",
      //Need correct access token for auth
      "Authorization": "dXNlcm5hbWU6cGFzc3dvcmQ=",
    }
  })
  .then((response) => console.log(response))
  // .then((data) => console.log(data));

}

safetyCheck();