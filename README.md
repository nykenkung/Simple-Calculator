# Simple-Calculator
https://nykenkung.github.io/Simple-Calculator/calculator.html

---------- calculator.html ----------
- Include \<div id="calculator"\> element to contain all calculator components.
- Inside the calculator div, it has:
- A display area (e.g., \<input type="text" id="display" readonly\>) to show input and results.
- Buttons for digits (0-9).
- Buttons for basic arithmetic operations (+, -, *, /).
- A button for the decimal point (.).
- A button for "Equals" (=).
- A button for "Clear" (C or AC).
- Link your calculator.css file for styling.
- Link your calculator.js file at the end of the <body> tag.

---------- calculator.css ----------
- Using CSS Grid for button layout to ensure a responsive design.
- Style the display area clearly.
- Style the buttons (background, text color, hover effects, etc.).
- Ensure buttons have appropriate padding and margins.

---------- calculator.js ----------:
- 'use strict'; statement at the top of the file.
- All calculator logic implemented using vanilla JavaScript and direct HTML DOM manipulation. No external libraries.
- Initialization: When the page loads, ensure the display is cleared.
- Event Handling:
- Attach event listeners to all calculator buttons. When a button is clicked, its corresponding action should be performed.
- Use a single event listener on the parent div#calculator and leverage event delegation to handle clicks on individual buttons (recommended for cleaner code and performance).
