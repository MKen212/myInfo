"use strict";

// Import axios as the HTTP request handler
import axios from "../node_modules/axios";

/* Overview of local storage values stored in object
const myInfo = {
  crypto1: "eth",
  currency1: "usd",
  crypto2: "xrp",
  currency2: "usd",
};
localStorage.setItem("myInfo", JSON.stringify(myInfo));
*/

// Lookup between Crypto currency codes and CoinGecko API IDS
const cryptoCodes = {
  eth : "ethereum",
  xrp : "ripple",

  getKey(ID) {
    return Object.keys(this).find(key => this[key] === ID);
  }
};

// Initialise Price Data
let priceData = {};

// Get Console Log Background Page
const bkg = chrome.extension.getBackgroundPage();

// Get the HTML elements to manipulate
// Form Fields
const form = document.querySelector(".form");
const crypto1 = document.getElementById("crypto1");
const currency1 = document.getElementById("currency1");
const crypto2 = document.getElementById("crypto2");
const currency2 = document.getElementById("currency2");

// Results
const resultsDiv = document.querySelector(".results-container");
const results = document.querySelector(".results");
const resetBtn = document.getElementById("resetBtn");

// Messages
const messagesDiv = document.querySelector(".messages");

// Add submit event listener to form
form.addEventListener("submit", (event) => handleSubmit(event));

// Add click event listener to reset button
resetBtn.addEventListener("click", (event) => reset(event));

// Initialise Function
function init() {
  // Get Data from local storage or blank object
  const storedData = localStorage.getItem("myInfo") ?
    JSON.parse(localStorage.getItem("myInfo")) :
    {};
  
  // If no stored data show form, else get data and show results
  if (Object.keys(storedData).length === 0) {
    form.style.display = "block";
    resultsDiv.style.display = "none";
  } else {
    form.style.display = "none";
    resultsDiv.style.display = "block";
    displayInfo(storedData);
  }
}

// Function to handle for submit
function handleSubmit(event) {
  event.preventDefault();
  // Prepare input data and store to Local Storage
  const myInfo = {
    crypto1: crypto1.value.toLowerCase(),
    currency1: currency1.value.toLowerCase(),
    crypto2: crypto2.value.toLowerCase(),
    currency2: currency2.value.toLowerCase(),
  };
  localStorage.setItem("myInfo", JSON.stringify(myInfo));
  // Get Data and show results
  form.style.display = "none";
  resultsDiv.style.display = "block";
  displayInfo(myInfo);
}

// Function to reset the stored data
function reset(event) {
  event.preventDefault();
  localStorage.removeItem("myInfo");
  results.innerHTML = "<p>No Data to Display.</p>";
  init();
}

// Function to Get and Display the Info
async function displayInfo(data) {
  try {
    displayMessage("Working...", "info");
    await getPrice(data.crypto1, data.currency1);
    await getPrice(data.crypto2, data.currency2);
    // bkg.console.log(priceData);
    if (Object.keys(priceData).length > 0) {
      const resultsHTML = `<h2>Current Prices:</h2>
        <p>${data.crypto1.toUpperCase()} > ${data.currency1.toUpperCase()}: ${priceData[cryptoCodes[data.crypto1]][data.currency1]}</p>
        <p>${data.crypto2.toUpperCase()} > ${data.currency2.toUpperCase()}: ${priceData[cryptoCodes[data.crypto2]][data.currency2]}</p>
      `;
      // bkg.console.log(resultsHTML);
      results.innerHTML = resultsHTML;
    }
  } catch (error) {
    bkg.console.log(error);
    displayMessage(error, "error");
  }
}



// Function to get the current  Crypto:Currency Price
async function getPrice(crypto, currency) {
  try {
    // Fix crypto code > ID
    const cryptoID = cryptoCodes[crypto];
    if (!cryptoID) {
      throw Error(`No lookup found for Crypto Code ${crypto}`);
    }
    // Get Data
    await axios
      .get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
          ids: cryptoID,
          vs_currencies: currency,
        },
      })
      .then((response) => {
        bkg.console.log(response);
        // Check data is returned
        if (Object.keys(response.data).length === 0) {
          throw Error(`No data found for ${crypto} > ${currency} pair`);
        } else {
          Object.assign(priceData, response.data);
        }
      });
  } catch (error) {
    bkg.console.log(error);
    displayMessage(error, "error");
  }
}

// Function to display a message for 2 seconds
function displayMessage(text, type) {
  messagesDiv.textContent = text;
  messagesDiv.classList.add(`msg-${type}`);

  setTimeout(() => {
    messagesDiv.textContent = "";
    messagesDiv.classList.remove(`msg-${type}`);
  }, 2000);
}


// Start the app
init();
