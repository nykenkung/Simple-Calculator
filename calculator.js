let display, expressionDiv;
let mainExpression = '';
let resultDisplayed = false;
let pendingOp = null;

document.addEventListener('DOMContentLoaded', () => {
    display = document.getElementById('display');
    expressionDiv = document.getElementById('expression');

    document.querySelectorAll('.fn').forEach(btn => {
        btn.addEventListener('click', () => handleFunction(btn.dataset.fn));
    });

    document.querySelectorAll('.digit').forEach(btn => {
        btn.addEventListener('click', () => appendToExpression(btn.textContent));
    });

    document.querySelectorAll('.operator').forEach(btn => {
        btn.addEventListener('click', () => appendOperator(btn.textContent));
    });

    document.querySelector('.decimal').addEventListener('click', () => appendToExpression('.'));
    document.querySelector('.clear').addEventListener('click', clearCalculator);
    document.querySelector('.equals').addEventListener('click', evaluateExpression);
});

// Append digits and decimals
function appendToExpression(val) {
    if (resultDisplayed) {
        mainExpression = '';
        resultDisplayed = false;
    }

    // If there's a pending operation (waiting for second number), update the second operand
    if (pendingOp) {
        pendingOp.secondOperand = (pendingOp.secondOperand || '') + val;

        // Update the display to show the filled placeholder
        if (pendingOp.type === 'power') {
            display.value = `${pendingOp.firstOperand}^${pendingOp.secondOperand}`;
        } else {
            display.value = `${pendingOp.secondOperand}√${pendingOp.firstOperand}`;
        }
    } else {
        mainExpression += val;
        display.value = mainExpression;
    }
}

// Append operators like + - * /
function appendOperator(op) {
    if (resultDisplayed) resultDisplayed = false;
    mainExpression += op;
    display.value = mainExpression;
}

// Clear everything
function clearCalculator() {
    mainExpression = '';
    pendingOp = null;
    resultDisplayed = false;
    display.value = ''; // Show nothing after clear
    expressionDiv.textContent = '';
}

// Evaluate the expression
function evaluateExpression() {
    try {
        if (pendingOp && pendingOp.secondOperand) {
            const first = parseFloat(pendingOp.firstOperand);
            const second = parseFloat(pendingOp.secondOperand);
            let result;

            // Evaluate power or root operations
            if (pendingOp.type === 'power') {
                result = Math.pow(first, second);
                expressionDiv.textContent = `${first}^${second} =`;
            } else if (pendingOp.type === 'root') {
                result = Math.pow(second, 1 / first);
                expressionDiv.textContent = `${first}√${second} =`;
            }

            mainExpression = String(result);
            display.value = result;
            pendingOp = null;
            resultDisplayed = true;
            return;
        }

        const result = eval(mainExpression);
        expressionDiv.textContent = `${mainExpression} =`;
        mainExpression = String(result);
        display.value = result;
        resultDisplayed = true;
    } catch {
        mainExpression = 'Error';
        display.value = 'Error';
    }
}

// Handle scientific and special functions
function handleFunction(funcName) {
    const isImmediate = ['square', 'sqrt', 'inv', '%', 'ln', 'log', 'sin', 'cos', 'tan'].includes(funcName);
    const isPending = ['power', 'root'].includes(funcName);

    if (!mainExpression && (isImmediate || isPending)) return;

    switch (funcName) {
        case 'square':
        case 'sqrt':
        case 'inv':
        case '%':
            try {
                const base = eval(mainExpression);
                let result;
                let label = '';

                if (funcName === 'square') {
                    label = `(${mainExpression})² =`;
                    result = Math.pow(base, 2);
                } else if (funcName === 'sqrt') {
                    label = `√(${mainExpression}) =`;
                    result = Math.sqrt(base);
                } else if (funcName === 'inv') {
                    label = `1/(${mainExpression}) =`;
                    result = 1 / base;
                } else {
                    label = `${mainExpression}% =`;
                    result = base / 100;
                }

                mainExpression = String(result);
                display.value = result;
                expressionDiv.textContent = label;
                resultDisplayed = true;
            } catch {
                mainExpression = 'Error';
                display.value = 'Error';
            }
            break;

        case 'ln':
            try {
                const result = Math.log(eval(mainExpression));
                expressionDiv.textContent = `ln(${mainExpression}) =`;
                mainExpression = String(result);
                display.value = result;
                resultDisplayed = true;
            } catch {
                mainExpression = 'Error';
                display.value = 'Error';
            }
            break;

        case 'log':
            try {
                const result = Math.log10(eval(mainExpression));
                expressionDiv.textContent = `log(${mainExpression}) =`;
                mainExpression = String(result);
                display.value = result;
                resultDisplayed = true;
            } catch {
                mainExpression = 'Error';
                display.value = 'Error';
            }
            break;

        case 'sin':
        case 'cos':
        case 'tan':
            try {
                const degrees = eval(mainExpression);
                const radians = (Math.PI / 180) * degrees;
                let result, label;

                if (funcName === 'sin') {
                    result = Math.sin(radians);
                    label = `sin(${degrees}) =`;
                } else if (funcName === 'cos') {
                    result = Math.cos(radians);
                    label = `cos(${degrees}) =`;
                } else {
                    result = Math.tan(radians);
                    label = `tan(${degrees}) =`;
                }

                mainExpression = String(result);
                display.value = result;
                expressionDiv.textContent = label;
                resultDisplayed = true;
            } catch {
                mainExpression = 'Error';
                display.value = 'Error';
            }
            break;

        case 'power':
        case 'root':
            pendingOp = {
                type: funcName,
                firstOperand: mainExpression
            };

            // Show placeholder for second operand
            if (funcName === 'power') {
                display.value = `${mainExpression}^`;  // First number ^ placeholder
            } else {
                display.value = `√${mainExpression}`;  // First number √ placeholder
            }

            expressionDiv.textContent = '';
            mainExpression = '';  // Clear the main expression
            break;

        case 'pi':
            mainExpression = String(Math.PI);
            display.value = mainExpression;
            resultDisplayed = true;
            break;

        case 'e':
            mainExpression = String(Math.E);
            display.value = mainExpression;
            resultDisplayed = true;
            break;

        default:
            mainExpression += `${funcName}(`;
            display.value = mainExpression;
            break;
    }
}