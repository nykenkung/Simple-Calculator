// Enforces strict mode, which helps catch common coding errors and "unsafe" actions.
'use strict';

document.addEventListener('DOMContentLoaded', () => {	// Create event listener
	function resetCalculator() {	// Function to initialize calculator
		previousText = '';	// Clear previous text
		operator = null;	// Clear operator
		currentText = '0';	// Set current text to 0
	}

	function calculate(previousText, currentText, operator) {	// Function to calculate result
		const a = parseFloat(previousText);	// Converts the first number string to a floating-point number.
		const b = parseFloat(currentText);	// Converts the second number string to a floating-point number.
		if (isNaN(a) || isNaN(b)) return 'Invalid input!';	// Return error message if parseFloat failed
		switch (operator) {		// Switch condition for different operator and equation
			case '+':		// Addition
				return a + b;
			case '-':		// Subtraction
				return a - b;
			case '*':		// Multiplication
				return a * b;
			case '/':		//Division 
				if (b === 0) return 'Can\'t divide by 0';	// Return error message if divide by zero
				return a / b;
			default:
				return 'Invalid operator!';
		}
	}

	const calculator = document.getElementById('calculator');	// Read from <div class="buttons">
	const display = document.getElementById('display');		// Read from <input type="text" id="display" readonly>
	let previousText, operator, currentText;			// Declare variables
	resetCalculator();						// Initialize calculator at start
	display.value = '0';

	calculator.addEventListener('click', (event) => {		// Create event listener for click event
		const calculatorTarget = event.target;			// Receive clicked html element

		if (calculatorTarget.tagName !== 'BUTTON') return;	// If no html element BUTTON clicked then exit

		const buttonClick = calculatorTarget.textContent;	// Read clicked button

		if (calculatorTarget.classList.contains('clear')) {	// If click C by <button class="clear"> then exit
			resetCalculator();
			display.value = '0';	// Set display screen value to 0
			return;
		}

		if (calculatorTarget.classList.contains('digit')) {	// If click number by <button class="digit">
			if (currentText === '0' && previousText === '' && buttonClick !== '0') display.value = '';	// If first time input 1-9 then update display screen

			currentText += buttonClick;
			display.value += buttonClick;
		}
// To Do List:
// 1) Aoid multiple 00 by checking every character in [currentText] contains other than 0:
// currentText.includes('.') && /[^0]/.test(currentText)
// 2) Add 0 after any [number+0] that becomes [number+] by checking last character of display.value include any operator
// ['+', '-', '*', '/'].includes(display.value.slice(-1))

		if (calculatorTarget.classList.contains('decimal')) {	// If click dot by <button class="decimal">
			if (currentText.includes('.')) return;		// If already exist decimal then exit
			if (currentText === '0') currentText = '0.';	// If enter decimal on 0 then decimal become 0.
			else currentText += '.';			// Add decimal after number
			display.value += '.';				// Update display screen
		}

		if (calculatorTarget.classList.contains('operator')) {		// If click operator by <button class="operator">
			operator = buttonClick;					// Set operator to text
			if (display.value === '0') display.value = '';
			if (currentText === '0') display.value += '0';
			if (previousText === '') previousText = currentText;	// If previous number not exist then store as previous number and move space for new number 
			else previousText = String(calculate(previousText, currentText, operator));
			if (previousText === 'Invalid input!' || previousText === 'Can\'t divide by 0') {
				display.value = previousText;
				resetCalculator();
				return;
			}
			currentText = '0';			// Initialize current text to 0
			display.value += operator;		// Update display screen
		}

		if (calculatorTarget.classList.contains('equals')) {		// If click =  by <button class="equals">
			if (previousText === '' || operator === null) return;	// If previous number or operator not exist then exit
			previousText = String(calculate(previousText, currentText, operator));
			if (previousText === 'Invalid input!' || previousText === 'Can\'t divide by 0!') {
				display.value = previousText;
				resetCalculator();
				return;
			}
			operator = null;	// Clear operator after calculation is completed
			currentText = '0';	// Initialize current text to 0

			display.value = previousText;
		}

	});
});