interface IReplaceDecimals {
  text: string;
  autoCorrect?: boolean;
}

interface IHumanAmount {
  originalAmount?: number | string;
  decimals: number;
}

interface IAmount {
  originalAmount?: number | string;
  humanAmount?: number;
  decimals: number;
  clipAmount?: boolean;
  decimalDigits?: boolean;
  maxDigits?: number;
  isCeil?: boolean;
}

interface IMaxDigits {
  decimalDigits: boolean;
  clipAmount: boolean;
  decimals: number;
  humanAmount: number;
}

interface IToFixed {
  number: number | string;
  decimals: number;
}

interface IShorterAmount {
  originalAmount: number | string;
  decimals: number;
}

export {
  IReplaceDecimals,
  IHumanAmount,
  IAmount,
  IMaxDigits,
  IToFixed,
  IShorterAmount,
};
