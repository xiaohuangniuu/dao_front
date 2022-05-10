import BigNumber from 'bignumber.js';

export const toBigNumber = (
    num?: number | bigint,
): BigNumber => {
    const value = new BigNumber(Number(num || 0));

    const zero = new BigNumber(0);

    if (value.isZero()) {
        return zero;
    }
    if (value.isNaN()) {
        return zero;
    }

    return value;
};