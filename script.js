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