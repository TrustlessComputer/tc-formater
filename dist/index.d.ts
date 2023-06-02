export declare const amount: {
    default: {
        formatAmount: (payload: IAmount) => string;
        number: (num: number) => string | number;
        toFixed: (payload: IToFixed) => string;
        shorterAmount: ({ originalAmount, decimals, }: IShorterAmount) => string;
    };
};

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

export { }
