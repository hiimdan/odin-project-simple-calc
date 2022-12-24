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

const backButton = document.querySelector('#backspace');
backButton.addEventListener('click', backspace);

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
    if (operand == '÷') {
        if (right === 0) {
            return undefined;
        }
        result = left / right;
    }
    if (result % 1 !== 0 && result >= 1e-7) {
        return Math.round(result * 10000000) / 10000000;
    } else {
        return result;
    }
}

function inputNumber(e) {
    if (currentOperator === null) {
        if (equalsPressed || prevValue === 'undefined') {
            prevValue = e.type == 'click' ? e.target.textContent : e.key;
            equalsPressed = false;
        } else {
            if (prevValue === '0' ||
                prevValue[prevValue.length - 1] === '%' ||
                !checkLength(prevValue)) {
                return;
            }
            prevValue += e.type == 'click' ? e.target.textContent : e.key;
        }
        calcDisplay.textContent = prevValue;
    } else {
        if (currentValue === '0' ||
            currentValue[currentValue.length - 1] === '%' ||
            !checkLength(currentValue)) {
            return;
        }
        currentValue += e.type == 'click' ? e.target.textContent : e.key;
        calcDisplay.textContent = currentValue;
    }
}

function clearScreen() {
    calcDisplay.textContent = '';
    prevValue = '';
    currentValue = '';
    currentOperator = null;
    applyOperatorStyle(null);
    equalsPressed = false;
}

function handleOperator(e) {
    if (calcDisplay.textContent && calcDisplay.textContent !== 'undefined') {
        if (currentOperator === null || !currentValue) {
            currentOperator = e.type == 'click' ? e.target.textContent : e.key;
            applyOperatorStyle(currentOperator);
        } else {
            let result = operate(parsePercent(prevValue), parsePercent(currentValue), currentOperator);
            prevValue = '' + result;
            calcDisplay.textContent = prevValue;
            currentOperator = prevValue === 'undefined' ? null : e.type == 'click' ? e.target.textContent : e.key;
            if (!currentOperator) {
                applyOperatorStyle(null);
            } else {
                applyOperatorStyle(currentOperator);
            }
            currentValue = '';
        }
    }
}

function applyOperatorStyle(symbol) {
    if (!symbol) {
        // operatorButtons.forEach(btn => btn.classList.remove('operator-pressed'));
        operatorButtons.forEach(btn => btn.style.backgroundColor = '');
    } else {
        operatorButtons.forEach(btn => {
            if (btn.textContent === symbol) {
                // btn.classList.add('operator-pressed');
                btn.style.backgroundColor = 'rgb(230, 230, 230)';
            } else {
                // btn.classList.remove('operator-pressed');
                btn.style.backgroundColor = '';
            }
        })
    }
}

function handleEquals() {
    if (prevValue && currentValue) {
        let result = operate(parsePercent(prevValue), parsePercent(currentValue), currentOperator);
        prevValue = '' + result;
        calcDisplay.textContent = prevValue;
        currentValue = '';
        currentOperator = null;
        applyOperatorStyle(null);
        equalsPressed = true;
    } else if (prevValue[prevValue.length - 1] === '%' && currentOperator === null) {
        equalsPressed = true;
        prevValue = '' + parsePercent(prevValue);
        calcDisplay.textContent = prevValue;
    }
}

function handleDecimal() {
    if (currentOperator === null) {
        if (!prevValue || prevValue === 'undefined') {
            calcDisplay.textContent = '0.';
            prevValue = '0.';
        } else if (!/\./.test(prevValue) && 
            prevValue !== '-' && 
            prevValue[prevValue.length - 1] !== '%' &&
            checkLength(prevValue)) {
            calcDisplay.textContent += '.';
            prevValue += '.';
            equalsPressed = false;
        }
    } else {
        if (!currentValue) {
            calcDisplay.textContent = '0.';
            currentValue = '0.';
        } else if (!/\./.test(currentValue) && 
            currentValue !== '-' && 
            currentValue[currentValue.length - 1] !== '%' &&
            checkLength(currentValue)) {
            calcDisplay.textContent += '.';
            currentValue += '.';
        }
    }
}

function negateValue() {
    if (calcDisplay.textContent && !/^0\.?0*$/.test(calcDisplay.textContent) && calcDisplay.textContent !== 'undefined') {
        if (currentOperator === null) {
            if (!checkLength(prevValue) && prevValue[0] !== '-') {
                return;
            }
            if (prevValue[0] === '-') {
                prevValue = prevValue.slice(1);
            } else {
                prevValue = '-' + prevValue;
            }
            calcDisplay.textContent = prevValue;
        } else if (currentValue ) {
            if (!checkLength(currentValue) && currentValue[0] !== '-') {
                return;
            }
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
    if (calcDisplay.textContent && 
        calcDisplay.textContent[calcDisplay.textContent.length - 1] !== '%' && 
        calcDisplay.textContent !== 'undefined' && 
        calcDisplay.textContent !== '-') {
        if (currentOperator === null) {
            if (!checkLength(prevValue)) {
                return;
            }
            if (equalsPressed) {
                equalsPressed = false;
            }
            if (prevValue === '0.' || prevValue === '-0.') {
                prevValue = '0%';
            } else {
                prevValue += '%';
            }
            calcDisplay.textContent = prevValue;
        } else if (currentValue && !checkLength(currentValue)) {
            if (currentValue === '0.' || currentValue === '-0.') {
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

function backspace() {
    if (prevValue === 'undefined') {
        clearScreen();
        return;
    }
    if (currentOperator === null && prevValue) {
        equalsPressed = false;
        prevValue = prevValue.slice(0, -1);
        calcDisplay.textContent = prevValue;
    } else if (currentValue) {
        currentValue = currentValue.slice(0, -1);
        calcDisplay.textContent = currentValue;
    }
}

window.addEventListener('keydown', handleKeyboardInput);

function handleKeyboardInput(e) {
    if (parseInt(e.key) >= 0 && parseInt(e.key) <= 9) {
        inputNumber(e);
    } else if (e.key == '/' || e.key == '*' || e.key == '+' || e.key == '-') {
        if (e.key == '*') {
            handleOperator({key: 'x'});
        } else if (e.key == '/') {
            handleOperator({key: '÷'});
        } else {
            handleOperator(e);
        }
    } else if (e.key == 'Enter') {
        handleEquals();
    } else if (e.key == 'Backspace') {
        backspace();
    } else if (e.key == '.') {
        handleDecimal();
    } else if (e.key == '%') {
        handlePercent();
    } else if (e.key == 'Delete') {
        clearScreen();
    }
}

function checkLength(str) {
    return str.length < 18 ? true : false;
}