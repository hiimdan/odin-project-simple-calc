const numberButtons = document.querySelectorAll('.number');
numberButtons.forEach(btn => {
    btn.addEventListener('click', inputNumber)
})

const clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', clearScreen);

const negateButton = document.querySelector('#negate');
negateButton.addEventListener('click', negateValue);

const percentButton = document.querySelector('#percent');
percentButton.addEventListener('click', handlePercent);

const operatorButtons = document.querySelectorAll('.operator');
operatorButtons.forEach(btn => {
    btn.addEventListener('click', handleOperator);
})

const equalsButton = document.querySelector('#equals');
equalsButton.addEventListener('click', handleEquals);

const decimalButton = document.querySelector('#decimal');
decimalButton.addEventListener('click', handleDecimal);

const calcDisplay = document.querySelector('#display');

let prevValue = '';
let currentValue = '';
let currentOperator = null;

let equalsPressed = false;

function operate(left, right, operand) {
    let result;
    if (operand == '+') {
        result = left + right;
    }
    if (operand == '-') {
        result = left - right;
    }
    if (operand == 'x') {
        result = left * right;
    }
    if (operand == '/') {
        result = left / right;
    }
    if (result % 1 !== 0) {
        return Math.round(result * 10000000) / 10000000;
    } else {
        return result;
    }
}

function inputNumber(e) {
    if (currentOperator === null) {
        if (equalsPressed) {
            prevValue = e.target.textContent;
            equalsPressed = false;
        } else {
            if (prevValue === '0') {
                return;
            }
            if (prevValue[prevValue.length - 1] === '%') {
                return;
            }
            prevValue += e.target.textContent;
        }
        calcDisplay.textContent = prevValue;
    } else {
        if (currentValue === '0') {
            return;
        }
        if (currentValue[currentValue.length - 1] === '%') {
            return;
        }
        currentValue += e.target.textContent;
        calcDisplay.textContent = currentValue;
    }
}

function clearScreen() {
    calcDisplay.textContent = '';
    prevValue = '';
    currentValue = '';
    currentOperator = null;
    equalsPressed = false;
}

function handleOperator(e) {
    if (calcDisplay.textContent) {
        if (currentOperator === null || !currentValue) {
            currentOperator = e.target.textContent;
        } else {
            let result = operate(parsePercent(prevValue), parsePercent(currentValue), currentOperator);
            prevValue = '' + result;
            calcDisplay.textContent = result;
            currentOperator = e.target.textContent;
            currentValue = '';
        }
    }
}

function handleEquals() {
    if (prevValue && currentValue) {
        let result = operate(parsePercent(prevValue), parsePercent(currentValue), currentOperator);
        prevValue = '' + result;
        calcDisplay.textContent = result;
        currentValue = '';
        currentOperator = null;
        equalsPressed = true;
    } else if (prevValue[prevValue.length - 1] === '%' && currentOperator === null) {
        equalsPressed = true;
        prevValue = parsePercent(prevValue);
        calcDisplay.textContent = prevValue;
    }
}

function handleDecimal() {
    if (currentOperator === null) {
        if (!prevValue) {
            calcDisplay.textContent = '0.';
            prevValue = '0.';
        } else if (!/\./.test(prevValue) && prevValue[prevValue.length - 1] !== '%') {
            calcDisplay.textContent += '.';
            prevValue += '.';
        }
    } else {
        if (!currentValue) {
            calcDisplay.textContent = '0.';
            currentValue = '0.';
        } else if (!/\./.test(currentValue) && currentValue[currentValue.length - 1] !== '%') {
            calcDisplay.textContent += '.';
            currentValue += '.';
        }
    }
}

function negateValue() {
    if (calcDisplay.textContent && !/^0\.?0*$/.test(calcDisplay.textContent)) {
        if (currentOperator === null) {
            if (prevValue[0] === '-') {
                prevValue = prevValue.slice(1);
            } else {
                prevValue = '-' + prevValue;
            }
            calcDisplay.textContent = prevValue;
        } else if (currentValue) {
            if (currentValue[0] === '-') {
                currentValue = currentValue.slice(1);
            } else {
                currentValue = '-' + currentValue;
            }
            calcDisplay.textContent = currentValue;
        }
    }
}

function handlePercent() {
    if (calcDisplay.textContent && calcDisplay.textContent[calcDisplay.textContent.length - 1] !== '%') {
        if (currentOperator === null) {
            if (equalsPressed) {
                equalsPressed = false;
            }
            if (prevValue === '0.') {
                prevValue = '0%';
            } else {
                prevValue += '%';
            }
            calcDisplay.textContent = prevValue;
        } else if (currentValue) {
            if (currentValue === '0.') {
                currentValue = '0%';
            } else {
                currentValue += '%';
            }
            calcDisplay.textContent = currentValue;
        }
    }
}

function parsePercent(str) {
    if (str[str.length -1 ] === '%') {
        return operate(str.slice(0, -1), 0.01, 'x');
    } else {
        return parseFloat(str);
    }
}