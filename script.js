const numberButtons = document.querySelectorAll('.number');
numberButtons.forEach(btn => {
    btn.addEventListener('click', inputNumber)
})

const clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', () => calcDisplay.textContent = '');

const calcDisplay = document.querySelector('#display');

function operate(left, right, operand) {
    if (operand == '+') {
        return left + right;
    }
    if (operand == '-') {
        return left - right;
    }
    if (operand == '*') {
        return left * right;
    }
    if (operand == '/') {
        return left / right;
    }
}

function inputNumber(e) {
    calcDisplay.textContent += e.target.textContent;
}