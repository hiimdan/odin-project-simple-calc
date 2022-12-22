const numberButtons = document.querySelectorAll('.number');
numberButtons.forEach(btn => {
    btn.addEventListener('click', inputNumber)
})

const clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', clearScreen);

const negateButton = document.querySelector('#negate');
negateButton.addEventListener('click', negateValue);

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
            if (e.target.textContent === '0' && prevValue === '0') {
                return;
            }
            prevValue += e.target.textContent;
        }
        calcDisplay.textContent = prevValue;
    } else {
        if (e.target.textContent === '0' && currentValue === '0') {
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
            let result = operate(parseFloat(prevValue), parseFloat(currentValue), currentOperator);
            prevValue = result;
            calcDisplay.textContent = result;
            currentOperator = e.target.textContent;
            currentValue = '';
        }
    }
}

function handleEquals() {
    if (prevValue && currentValue) {
        let result = operate(parseFloat(prevValue), parseFloat(currentValue), currentOperator);
        prevValue = result;
        calcDisplay.textContent = result;
        currentValue = '';
        currentOperator = null;
        equalsPressed = true;
    }
}

function handleDecimal() {
    if (currentOperator === null) {
        if (!prevValue) {
            calcDisplay.textContent = '0.';
            prevValue = '0.';
        } else if (!/\./.test(prevValue)) {
            calcDisplay.textContent += '.';
            prevValue += '.';
        }
    } else {
        if (!currentValue) {
            calcDisplay.textContent = '0.';
            currentValue = '0.';
        } else if (!/\./.test(currentValue)) {
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
        } else {
            if (currentValue[0] === '-') {
                currentValue = currentValue.slice(1);
            } else {
                currentValue = '-' + currentValue;
            }
            calcDisplay.textContent = currentValue;
        }
    }
}