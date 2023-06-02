import { BigNumber } from 'bignumber.js';
import { getDecimalSeparator, getGroupSeparator } from '@/lib/amount/separator';
import convertAmount from '@/lib/amount/convert';
import { IAmount, IMaxDigits, IShorterAmount, IToFixed } from '@/types/amount';

const removeTrailingZeroes = ({ amountString }: { amountString: string }) => {
  let formattedString = amountString;
  const decimalSeparator = getDecimalSeparator();
  while (
    formattedString.length > 0 &&
    ((formattedString.includes(decimalSeparator) &&
      formattedString[formattedString.length - 1] === '0') ||
      formattedString[formattedString.length - 1] === decimalSeparator)
  ) {
    formattedString = formattedString.slice(0, formattedString.length - 1);
  }

  return formattedString;
};

const getMaxDecimalDigits = (payload: IMaxDigits) => {
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
  } catch (error) {
    maxDigits = decimals;
    throw error;
  }
  return maxDigits;
};

const toFixed = (payload: IToFixed) => {
  const decimalSeparator = getDecimalSeparator();
  const { number, decimals } = payload;
  const bigNumber = new BigNumber(number);
  if (bigNumber.isNaN()) {
    return '0';
  }
  return removeTrailingZeroes({
    amountString: bigNumber.toFixed(decimals).replace('.', decimalSeparator),
  });
};

const formatAmount = (payload: IAmount) => {
  const {
    originalAmount,
    humanAmount,
    decimals,
    clipAmount = true,
    decimalDigits = true,
    maxDigits,
    isCeil = false,
  } = payload;
  const decimalSeparator = getDecimalSeparator();
  const groupSeparator = getGroupSeparator();
  const fmt = {
    decimalSeparator,
    groupSeparator,
    groupSize: 3,
  };
  let formatedAmount;
  try {
    const convertHumanAmount =
      humanAmount ||
      convertAmount.toHumanAmount({
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
      fixedNumber = new BigNumber(convertHumanAmount).toFormat(
        Math.min(decimals, _maxDigits),
        isCeil ? BigNumber.ROUND_CEIL : BigNumber.ROUND_FLOOR
      );
    } else {
      fixedNumber = new BigNumber(convertHumanAmount).toFormat(
        _maxDigits,
        isCeil ? BigNumber.ROUND_CEIL : BigNumber.ROUND_FLOOR
      );
    }
    const fixedString = toFixed({
      number: fixedNumber,
      decimals,
    });
    const amountString = new BigNumber(fixedString).toFormat(
      _maxDigits,
      isCeil ? BigNumber.ROUND_CEIL : BigNumber.ROUND_DOWN,
      fmt
    );
    formatedAmount = removeTrailingZeroes({
      amountString,
    });
  } catch (error) {
    formatedAmount = '0';
    throw error;
  }
  return formatedAmount;
};

const number = (num: number) => {
  const fmt = {
    decimalSeparator: getDecimalSeparator(),
    groupSeparator: getGroupSeparator(),
    groupSize: 3,
  };
  const rs = new BigNumber(num);
  return rs.isFinite() ? rs.toFormat(fmt) : num;
};

const getDecimalsFromHumanAmount = (
  humanAmount: number,
  defaultDecimals: number
) => {
  let decimals;
  if (humanAmount > 10) {
    decimals = 2;
  } else if (humanAmount > 1) {
    decimals = 3;
  } else if (humanAmount > 1e-4) {
    // 0.0001
    decimals = 4;
  } else if (humanAmount > 1e-5) {
    // 0.00001
    decimals = 5;
  } else {
    decimals = Math.max(defaultDecimals, 6);
  }
  return decimals;
};

const shorterAmount = ({
  originalAmount,
  decimals,
}: IShorterAmount): string => {
  try {
    const _amount = convertAmount.toHumanAmount({ originalAmount, decimals });
    const _decimals = getDecimalsFromHumanAmount(_amount, decimals);
    return _amount
      ? removeTrailingZeroes({
          amountString: new BigNumber(_amount).toFormat(
            _decimals,
            BigNumber.ROUND_DOWN
          ),
        }).toString()
      : '0';
  } catch (e) {
    return '0';
  }
};
const format = {
  formatAmount,
  number,
  toFixed,
  shorterAmount,
};

export default format;
