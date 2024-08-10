'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);



document.addEventListener("selectstart", e => {
  console.log('selectstart event');
});
 document.addEventListener("selectionchange", () => {
  console.log(document.getSelection());

  // Create a new div element
  let popup = document.createElement("div");

  // Set the content of the div
  popup.innerHTML = "<p>This is a popup!</p>";

  // Style the div to look like a popup
  popup.style.position = "fixed"; // Position it relative to the viewport
  popup.style.backgroundColor = "#f9f9f9";
  popup.style.border = "1px solid #ccc";
  popup.style.padding = "10px";
  popup.style.zIndex = "10001"; // Make sure it's on top of other elements
  
  // Append the div to the body
  document.body.appendChild(popup);
  popup.style.zIndex = 10000;
  // Position the div at the mouse pointer
  document.onmousemove = function(e) {
    popup.style.left = e.pageX + 'px';
    popup.style.top = e.pageY + 'px';
  };
});

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  response => {
    console.log(response.message);
  }
);

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log(`Current count is ${request.payload.count}`);
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
