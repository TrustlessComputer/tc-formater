import { IEllipsisCenter, IStartAddress } from '@/types/address';

const ellipsisCenter = (payload: IEllipsisCenter) => {
  const { str, limit = 6, start = 0, end = 0, dots = '...' } = payload;
  try {
    const size = str.length;
    if (size < (start && end ? start + end : limit * 2) + dots.length) {
      return str;
    }

    const leftStr = str.substring(0, start || limit);
    const rightStr = str.substring(size - (end || limit), size);
    return leftStr + dots + rightStr;
  } catch {
    return str;
  }
};

const startAddress = ({ address, length = 10 }: IStartAddress): string => {
  if (!address) return '';
  if (address.length < 14) return address;
  return `${address.substring(0, length)}`;
};

export { ellipsisCenter, startAddress };
