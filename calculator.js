'use strict';

document.addEventListener('DOMContentLoaded', () => {
	const display = document.getElementById('display');
	const calculator = document.getElementById('calculator');
	let currentInput = '0';
	let operator = null;
	let previousInput = '';
	let resetDisplay = false;
	display.value = currentInput;

	calculator.addEventListener('click', (event) => {
		const target = event.target;
		if (!target.tagName === 'BUTTON') return;
		const buttonText = target.textContent;

		if (target.classList.contains('digit')) {
			if (resetDisplay) {
				currentInput = buttonText;
				resetDisplay = false;
			}
			else currentInput = currentInput === '0' ? buttonText : currentInput + buttonText;
		}
		else if (target.classList.contains('decimal')) {
			if (resetDisplay) {
				currentInput = '0.';
				resetDisplay = false;
			}
			else if (!currentInput.includes('.')) currentInput += '.';
		}
		else if (target.classList.contains('operator')) {
			if (previousInput !== '' && operator !== null && !resetDisplay) {
				currentInput = String(calculate(previousInput, currentInput, operator));
				if (currentInput === 'Error') {
					resetCalculator();
					return;
				}
			}
			operator = buttonText;
			previousInput = currentInput;
			resetDisplay = true;
		} else if (target.classList.contains('equals')) {
			if (operator === null || previousInput === '') return;
			currentInput = String(calculate(previousInput, currentInput, operator));
			if (currentInput === 'Error') {
				resetCalculator();
				return;
			}
			operator = null;
			previousInput = '';
			resetDisplay = true;
		} else if (target.classList.contains('clear')) resetCalculator();
		display.value = currentInput;
	});

	function calculate(num1, num2, op) {
		const a = parseFloat(num1);
		const b = parseFloat(num2);
		if (isNaN(a) || isNaN(b)) return 'Error';

		switch (op) {
			case '+':
			return a + b;
			case '-':
			return a - b;
			case '*':
			return a * b;
			case '/':
			if (b === 0) return 'Error';
			return a / b;
			default:
			return 'Error';
		}
	}

	function resetCalculator() {
		currentInput = '0';
		operator = null;
		previousInput = '';
		resetDisplay = false;
		display.value = currentInput;
	}
});