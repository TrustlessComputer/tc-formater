import { IAmount as IAmount_2 } from '@/types/amount';
import { IEllipsisCenter } from '@/types/address';
import { IHumanAmount as IHumanAmount_2 } from '@/types/amount';
import { IReplaceDecimals as IReplaceDecimals_2 } from '@/types/amount';
import { IShorterAmount as IShorterAmount_2 } from '@/types/amount';
import { IStartAddress } from '@/types/address';
import { IToFixed as IToFixed_2 } from '@/types/amount';

export declare const checkAmount: (amount: number) => void;

export declare const ellipsisCenter: (payload: IEllipsisCenter) => string;

export declare const formatAmount: (payload: IAmount_2) => string;

export declare interface IAmount {
    originalAmount?: number | string;
    humanAmount?: number;
    decimals: number;
    clipAmount?: boolean;
    decimalDigits?: boolean;
    maxDigits?: number;
    isCeil?: boolean;
}

export declare interface IHumanAmount {
    originalAmount?: number | string;
    decimals: number;
}

export declare interface IMaxDigits {
    decimalDigits: boolean;
    clipAmount: boolean;
    decimals: number;
    humanAmount: number;
}

export declare interface IReplaceDecimals {
    text: string;
    autoCorrect?: boolean;
}

export declare interface IShorterAmount {
    originalAmount: number | string;
    decimals: number;
}

export declare interface IToFixed {
    number: number | string;
    decimals: number;
}

export declare const number: (num: number) => string | number;

export declare const replaceDecimals: ({ text, autoCorrect }: IReplaceDecimals_2) => string;

export declare const shorterAmount: ({ originalAmount, decimals, }: IShorterAmount_2) => string;

export declare const startAddress: ({ address, length }: IStartAddress) => string;

export declare const toFixed: (payload: IToFixed_2) => string;

export declare const toHumanAmount: (payload: IHumanAmount_2) => number;

export declare const toHumanAmountString: (payload: IHumanAmount_2) => string;

export declare const toNumber: ({ text, autoCorrect, }: {
    text: string;
    autoCorrect?: boolean | undefined;
}) => number;

export declare const toOriginalAmount: ({ humanAmount, decimals, round, }: {
    humanAmount: string;
    decimals: number;
    round?: boolean | undefined;
}) => number;

declare const toString_2: ({ text, autoCorrect, }: {
    text: string;
    autoCorrect?: boolean | undefined;
}) => string;
export { toString_2 as toString }

export { }
