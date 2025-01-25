type EthereumProvider = {
  isMetaMask?: boolean;
  request: <T = any>(args: { method: string; params?: any[] }) => Promise<T>;
  on?: (event: string, callback: (...args: any[]) => void) => void;
  removeListener?: (event: string, callback: (...args: any[]) => void) => void;
  selectedAddress?: string;
  networkVersion?: string;
  chainId?: string;
};

type TokenPocketProvider = {
  request: <T = any>(args: { method: string; params?: any[] }) => Promise<T>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    TokenPocket?: TokenPocketProvider;
  }
}