'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const display = document.getElementById('display');
    const expressionDiv = document.getElementById('expression');
    const buttonsContainer = document.querySelector('.buttons');
    const calculator = document.getElementById('calculator');

    // --- State Management ---
    let mainExpression = '';      // Stores the committed parts of the calculation
    let pendingOp = null;         // Object to hold details of a pending function
    let resultDisplayed = false;

    /**
     * Resets the calculator to its initial state.
     */
    function clearAll() {
        mainExpression = '';
        pendingOp = null;
        resultDisplayed = false;
        display.value = '0';
        expressionDiv.textContent = '';
    }

    /**
     * Updates the main display based on the current state.
     */
    function updateDisplay() {
        if (pendingOp) {
            let pendingStr = '';
            switch (pendingOp.type) {
                case 'power':
                    pendingStr = `(${pendingOp.firstOperand})^${pendingOp.input || ''}`;
                    break;
                case 'root':
                    pendingStr = `${pendingOp.input || ''}√(${pendingOp.firstOperand})`;
                    break;
                case 'ln':
                    pendingStr = `ln(${pendingOp.input || ''})`;
                    break;
                case 'log':
                    pendingStr = `log(${pendingOp.input || ''})`;
                    break;
                case 'sin':
                    pendingStr = `sin(${pendingOp.input || ''})`;
                    break;
                case 'cos':
                    pendingStr = `cos(${pendingOp.input || ''})`;
                    break;
                case 'tan':
                    pendingStr = `tan(${pendingOp.input || ''})`;
                    break;
            }
            display.value = mainExpression + pendingStr;
        } else {
            display.value = mainExpression || '0';
        }
    }

    /**
     * Commits the pending operation, evaluates it, and updates the main expression with the result.
     * @returns {string} The string representation of the calculation for the top display.
     */
    function commitPendingOperation() {
        if (!pendingOp || pendingOp.input === '') {
            pendingOp = null;
            return '';
        }

        let expressionToEvaluate = '';
        let displayString = '';
        const degToRad = `(Math.PI / 180 * ${pendingOp.input})`;

        switch (pendingOp.type) {
            case 'power':
                expressionToEvaluate = `Math.pow(${pendingOp.firstOperand}, ${pendingOp.input})`;
                displayString = `${pendingOp.firstOperand}^${pendingOp.input}`;
                break;
            case 'root':
                expressionToEvaluate = `Math.pow(${pendingOp.firstOperand}, 1/${pendingOp.input})`;
                displayString = `${pendingOp.input}√(${pendingOp.firstOperand})`;
                break;
            case 'ln':
                expressionToEvaluate = `Math.log(${pendingOp.input})`;
                displayString = `ln(${pendingOp.input})`;
                break;
            case 'log':
                expressionToEvaluate = `Math.log10(${pendingOp.input})`;
                displayString = `log(${pendingOp.input})`;
                break;
            case 'sin':
                expressionToEvaluate = `Math.sin(${degToRad})`;
                displayString = `sin(${pendingOp.input})`;
                break;
            case 'cos':
                expressionToEvaluate = `Math.cos(${degToRad})`;
                displayString = `cos(${pendingOp.input})`;
                break;
            case 'tan':
                expressionToEvaluate = `Math.tan(${degToRad})`;
                displayString = `tan(${pendingOp.input})`;
                break;
        }

        try {
            const result = new Function('return ' + expressionToEvaluate)();
            mainExpression = String(parseFloat(result.toPrecision(14)));
        } catch (error) {
            mainExpression = 'Error';
        } finally {
            pendingOp = null;
        }
        return displayString;
    }

    /**
     * Handles all button clicks using event delegation.
     */
    function onButtonClick(e) {
        if (e.target.tagName !== 'BUTTON') return;
        
        const button = e.target;
        const value = button.textContent;
        const isDigit = button.classList.contains('digit') || button.classList.contains('decimal');
        
        // If the result is displayed and the user presses a new button, reset the calculator
        if (resultDisplayed && (isDigit || button.dataset.fn)) {
            mainExpression = display.value;  // Start with the result as the next input
            resultDisplayed = false;
        }
        
        if (resultDisplayed) {
            resultDisplayed = false;
        }

        // If display is '0' and a digit is pressed, remove '0' and append the digit
        if (mainExpression === '0' && isDigit) mainExpression = '';

        if (pendingOp) {
            if (isDigit) {
                // Add digits to the pending input
                pendingOp.input += value;
            } else if (button.classList.contains('equals')) {
                // When equals is pressed, commit the pending operation and update the display
                const committedString = commitPendingOperation();
                expressionDiv.textContent = committedString + ' =';
                resultDisplayed = true;
            }
        } else {
            if (isDigit) {
                // Append digits to the main expression
                mainExpression += value;
            } else if (button.classList.contains('operator')) {
                // Append operators to the main expression
                mainExpression += value;
            } else if (button.classList.contains('equals')) {
                // Evaluate the final expression when equals is pressed
                calculate();
            } else if (button.classList.contains('clear')) {
                // Clear the calculator
                clearAll();
            } else if (button.dataset.fn) {
                // Handle functions (like square, sqrt, sin, etc.)
                handleFunction(button.dataset.fn);
            }
        }
        
        // Always update the display to reflect the latest expression or result
        updateDisplay();
    }

    /**
     * Handles function buttons, either by performing an immediate calculation or setting up a pending operation.
     */
    function handleFunction(funcName) {
        const isImmediate = ['square', 'sqrt', 'inv', '%'].includes(funcName);
        const isPending = ['ln', 'log', 'sin', 'cos', 'tan', 'power', 'root'].includes(funcName);

        if (!mainExpression && (isImmediate || isPending)) return;

        switch (funcName) {
            case 'square':
            case 'sqrt':
            case 'inv':
            case '%':
                try {
                    const baseExpression = mainExpression;
                    let result;
                    let topDisplayString = '';
                    if (funcName === 'square') {
                        topDisplayString = `(${baseExpression})² =`;
                        result = new Function('return Math.pow(' + baseExpression + ', 2)')();
                    } else if (funcName === 'sqrt') {
                        topDisplayString = `√(${baseExpression}) =`;
                        result = new Function('return Math.sqrt(' + baseExpression + ')')();
                    } else if (funcName === 'inv') {
                        topDisplayString = `1/(${baseExpression}) =`;
                        result = new Function('return 1/(' + baseExpression + ')')();
                    } else { // Percent
                        topDisplayString = `${baseExpression}% =`;
                        result = new Function('return (' + baseExpression + ') / 100')();
                    }
                    expressionDiv.textContent = topDisplayString;
                    mainExpression = String(result);
                    resultDisplayed = true;
                    display.value = result;  // Update the display directly
                } catch {
                    mainExpression = 'Error';
                    display.value = 'Error';  // Show error directly on the display
                }
                break;
            case 'power':
            case 'root':
            case 'ln':
            case 'log':
            case 'sin':
            case 'cos':
            case 'tan':
                pendingOp = { 
                    type: funcName, 
                    firstOperand: mainExpression, // Used by power/root
                    input: '' 
                };
                mainExpression = '';
                break;
            case 'pi':
                mainExpression = String(Math.PI);
                resultDisplayed = true;
                display.value = Math.PI;  // Directly update the display with Pi value
                break;
            case 'e':
                mainExpression = String(Math.E);
                resultDisplayed = true;
                display.value = Math.E;  // Directly update the display with Euler's constant
                break;
            default:
                mainExpression += `${funcName}(`;
                break;
        }
    }

    /**
     * Evaluates the final expression when equals is pressed.
     */
    function calculate() {
        if (mainExpression === '' || mainExpression === 'Error') return;
        
        expressionDiv.textContent = mainExpression + ' =';
        try {
            const result = new Function('return ' + mainExpression)();
            mainExpression = String(parseFloat(result.toPrecision(14)));
            resultDisplayed = true;
            display.value = mainExpression;  // Update the display with the result
        } catch (error) {
            mainExpression = 'Error';
            resultDisplayed = true;
            display.value = 'Error';  // Show error directly on the display
        }
    }

    // --- Event Listeners and Initialization ---
    buttonsContainer.addEventListener('click', onButtonClick);
    clearAll();
    calculator.focus();
});