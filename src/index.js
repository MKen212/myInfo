"use strict";

/* TO REMOVE
const myInfo = {
  "crypto1": "eth",
  "currency1": "usd",
  "crypto2": "xrp",
  "currency2": "usd",
};
localStorage.setItem("myInfo", JSON.stringify(myInfo));
*/

// Import axios as the HTTP request handler
import axios from "../node_modules/axios";

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

// Add submit event listener to form
form.addEventListener("submit", (event) => handleSubmit(event));

// Add click event listener to reset button
resetBtn.addEventListener("click", (event) => reset(event));

// Initialise Function
function init() {
  // Get Data from local storage
  let storedData = localStorage.getItem("myInfo") ?
    JSON.parse(localStorage.getItem("myInfo")) :
    {};
  
  // If no stored data show form, else get data and show results
  if (!storedData) {
    form.style.visibility = "visible";
    resultsDiv.style.visibility = "hidden";
  } else {
    form.style.visibility = "hidden";
    resultsDiv.style.visibility = "visible";
  }
}


// Start the app
init();

