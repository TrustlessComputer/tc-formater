'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var bignumber_js = require('bignumber.js');

const decimalSeparator = '.';
const groupSeparator = ',';
function getDecimalSeparator() {
    return decimalSeparator;
}
function getGroupSeparator() {
    return groupSeparator;
}

const removeTrailingZeroes = ({ amountString }) => {
    let formattedString = amountString;
    const decimalSeparator = getDecimalSeparator();
    while (formattedString.length > 0 &&
        ((formattedString.includes(decimalSeparator) &&
            formattedString[formattedString.length - 1] === '0') ||
            formattedString[formattedString.length - 1] === decimalSeparator)) {
        formattedString = formattedString.slice(0, formattedString.length - 1);
    }
    return formattedString;
};
const getMaxDecimalDigits = (payload) => {
    const { decimals, decimalDigits, clipAmount, humanAmount } = payload;
    let maxDigits = decimals;
    try {
        if (clipAmount) {
            if (humanAmount > 0 && humanAmount < 1 && decimalDigits) {
                maxDigits = 5;
            }
            if (humanAmount > 1) {
                maxDigits = 4;
            }
            if (humanAmount > 1e3) {
                maxDigits = 2;
            }
            if (humanAmount > 1e5) {
                maxDigits = 0;
            }
        }
    }
    catch (error) {
        maxDigits = decimals;
        throw error;
    }
    return maxDigits;
};
const toFixed = (payload) => {
    const decimalSeparator = getDecimalSeparator();
    const { number, decimals } = payload;
    const bigNumber = new bignumber_js.BigNumber(number);
    if (bigNumber.isNaN()) {
        return '0';
    }
    return removeTrailingZeroes({
        amountString: bigNumber.toFixed(decimals).replace('.', decimalSeparator),
    });
};
const formatAmount = (payload) => {
    const { originalAmount, humanAmount, decimals, clipAmount = true, decimalDigits = true, maxDigits, isCeil = false, } = payload;
    const decimalSeparator = getDecimalSeparator();
    const groupSeparator = getGroupSeparator();
    const fmt = {
        decimalSeparator,
        groupSeparator,
        groupSize: 3,
    };
    let formatedAmount;
    try {
        const convertHumanAmount = humanAmount ||
            toHumanAmount({
                originalAmount,
                decimals,
            });
        const _maxDigits = maxDigits
            ? maxDigits
            : getMaxDecimalDigits({
                clipAmount,
                decimalDigits,
                decimals,
                humanAmount: convertHumanAmount,
            });
        let fixedNumber;
        if (decimals) {
            fixedNumber = new bignumber_js.BigNumber(convertHumanAmount).toFormat(Math.min(decimals, _maxDigits), isCeil ? bignumber_js.BigNumber.ROUND_CEIL : bignumber_js.BigNumber.ROUND_FLOOR);
        }
        else {
            fixedNumber = new bignumber_js.BigNumber(convertHumanAmount).toFormat(_maxDigits, isCeil ? bignumber_js.BigNumber.ROUND_CEIL : bignumber_js.BigNumber.ROUND_FLOOR);
        }
        const fixedString = toFixed({
            number: fixedNumber,
            decimals,
        });
        const amountString = new bignumber_js.BigNumber(fixedString).toFormat(_maxDigits, isCeil ? bignumber_js.BigNumber.ROUND_CEIL : bignumber_js.BigNumber.ROUND_DOWN, fmt);
        formatedAmount = removeTrailingZeroes({
            amountString,
        });
    }
    catch (error) {
        formatedAmount = '0';
        throw error;
    }
    return formatedAmount;
};
const number = (num) => {
    const fmt = {
        decimalSeparator: getDecimalSeparator(),
        groupSeparator: getGroupSeparator(),
        groupSize: 3,
    };
    const rs = new bignumber_js.BigNumber(num);
    return rs.isFinite() ? rs.toFormat(fmt) : num;
};
const getDecimalsFromHumanAmount = (humanAmount, defaultDecimals) => {
    let decimals;
    if (humanAmount > 10) {
        decimals = 2;
    }
    else if (humanAmount > 1) {
        decimals = 3;
    }
    else if (humanAmount > 1e-4) {
        // 0.0001
        decimals = 4;
    }
    else if (humanAmount > 1e-5) {
        // 0.00001
        decimals = 5;
    }
    else {
        decimals = Math.max(defaultDecimals, 6);
    }
    return decimals;
};
const shorterAmount = ({ originalAmount, decimals, }) => {
    try {
        const _amount = toHumanAmount({ originalAmount, decimals });
        const _decimals = getDecimalsFromHumanAmount(_amount, decimals);
        return _amount
            ? removeTrailingZeroes({
                amountString: new bignumber_js.BigNumber(_amount).toFormat(_decimals, bignumber_js.BigNumber.ROUND_DOWN),
            }).toString()
            : '0';
    }
    catch (e) {
        return '0';
    }
};

const checkAmount = (amount) => {
    if (!Number.isFinite(amount))
        throw new Error('Can not format invalid amount');
};
const replaceDecimals = ({ text, autoCorrect = false }) => {
    let result = text;
    if (autoCorrect) {
        result = result.replace(/,/g, '');
    }
    return result;
};
const toHumanAmount = (payload) => {
    const { originalAmount = 0, decimals } = payload;
    const amount = new bignumber_js.BigNumber(originalAmount);
    if (amount.isNaN()) {
        return 0;
    }
    const indexNumber = new bignumber_js.BigNumber(10).pow(decimals);
    return amount.dividedBy(indexNumber).toNumber();
};
const toHumanAmountString = (payload) => {
    return toFixed({
        number: toHumanAmount({
            originalAmount: payload.originalAmount || 0,
            decimals: payload.decimals,
        }),
        decimals: payload.decimals,
    });
};
const toOriginalAmount = ({ humanAmount, decimals, round = true, }) => {
    let amount = 0;
    try {
        const amountRepDecimals = replaceDecimals({
            text: humanAmount,
        });
        const bnAmount = new bignumber_js.BigNumber(amountRepDecimals);
        if (bnAmount.isNaN()) {
            return 0;
        }
        const indexNumber = new bignumber_js.BigNumber(10).pow(decimals || 0).toNumber();
        amount = bnAmount.multipliedBy(new bignumber_js.BigNumber(indexNumber)).toNumber();
        if (round) {
            amount = Math.floor(amount);
        }
    }
    catch (error) {
        amount = 0;
        throw error;
    }
    return amount;
};
const toNumber = ({ text, autoCorrect = true, }) => {
    const number = replaceDecimals({
        text,
        autoCorrect,
    });
    return new bignumber_js.BigNumber(number).toNumber();
};
const toString = ({ text, autoCorrect = true, }) => {
    const number = replaceDecimals({
        text,
        autoCorrect,
    });
    return new bignumber_js.BigNumber(number).toString();
};

exports.checkAmount = checkAmount;
exports.formatAmount = formatAmount;
exports.number = number;
exports.replaceDecimals = replaceDecimals;
exports.shorterAmount = shorterAmount;
exports.toFixed = toFixed;
exports.toHumanAmount = toHumanAmount;
exports.toHumanAmountString = toHumanAmountString;
exports.toNumber = toNumber;
exports.toOriginalAmount = toOriginalAmount;
exports.toString = toString;
//# sourceMappingURL=tc-formatter-package.js.map
