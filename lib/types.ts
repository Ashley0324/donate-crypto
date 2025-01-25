import { type MetaMaskInpageProvider } from '@metamask/providers';

type EthereumProvider = MetaMaskInpageProvider & {
  request: <T = any>(args: { method: string; params?: any[] }) => Promise<T>;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
    TokenPocket?: {
      request: <T = any>(args: { method: string; params?: any[] }) => Promise<T>;
    };
  }
}

export type WalletType = "metamask" | "tp";

export {};