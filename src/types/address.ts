interface IEllipsisCenter {
  str: string;
  limit?: number;
  dots?: string;
  start?: number;
  end?: number;
}

interface IStartAddress {
  address?: string;
  length?: number;
}

export { IEllipsisCenter, IStartAddress };
