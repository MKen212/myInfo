"use strict";

// Setup defaults
const preURL = "https://api.coingecko.com/api/v3/";

// Get HTML Elements & Buttons
const messagesDiv = document.querySelector(".messages");
const resultsDiv = document.querySelector(".results");
const coinList = document.getElementById("coinList");
const currencyList = document.getElementById("currencyList");


// Add Event Listeners to Buttons
coinList.addEventListener("click", getCoinList);
currencyList.addEventListener("click", getCurrencyList);

// Function to get list of Coins/Cryptos
async function getCoinList() {
  try {
    displayMessage("Working getting Coin List...", "info");
    const fullURL = preURL + "coins/list";
    const response = await fetch(fullURL);
    // console.log(response);
    if (response.ok === false) {
      throw Error(`No Data Retrieved. Code: ${response.status} / Text: ${response.statusText}`);
    }
    const result = await response.json();
  
    // Prepare HTML for output
    const resultHTML = result.map((item) => {
      return `<tr><td>${item.id}</td><td>${item.symbol}</td><td>${item.name}</td></tr>`;
    }).join("");
    
    // Output to DIV
    resultsDiv.innerHTML = `<table class="table-centred">
      <thead>
        <tr><th>ID</th><th>Symbol</th><th>Name</th></tr>
      </thead>
      <tbody>
        ${resultHTML}
      </tbody>
    </table>`;
    displayMessage("Success getting Coin List...", "success");
  } catch (error) {
    console.log(error);
    displayMessage(error, "error");
  }
}

// Function to get list of Currencies
async function getCurrencyList() {
  try {
    // displayMessage("Working getting Currency List...", "info");
    const fullURL = preURL + "simple/supported_vs_currencies";
    const response = await fetch(fullURL);
    // console.log(response);
    if (response.ok === false) {
      throw Error(`No Data Retrieved. Code: ${response.status} / Text: ${response.statusText}`);
    }
    const result = await response.json();
  
    // Prepare HTML for output
    const resultHTML = result.map((item) => {
      return `<tr><td>${item}</td></tr>`;
    }).join("");
    
    // Output to DIV
    resultsDiv.innerHTML = `<table class="table-centred">
      <thead>
        <tr><th>CurrencyID</th></tr>
      </thead>
      <tbody>
        ${resultHTML}
      </tbody>
    </table>`;
    displayMessage("Success getting Currency List...", "success");
  } catch (error) {
    console.log(error);
    displayMessage(error, "error");
  }
}

// Function to display a message for 3 seconds
function displayMessage(text, type) {
  messagesDiv.textContent = text;
  messagesDiv.classList.add(`msg-${type}`);

  setTimeout(() => {
    messagesDiv.textContent = "";
    messagesDiv.classList.remove(`msg-${type}`);
  }, 3000);
}
