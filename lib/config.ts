export type NetworkConfig = {
    name: string;
    chainId: number;
    rpcUrl: string;
    blockExplorer: string;
    usdtAddress: string;
    nftAddress?: string; // 部署后填入
}

const isDevelopment = process.env.NODE_ENV === 'development'
console.log('Config Environment:', {
    isDevelopment,
    env: process.env.NODE_ENV,
    defaultNetwork: process.env.NEXT_PUBLIC_DEFAULT_NETWORK
})

// 定义所有可用的网络配置
const ALL_NETWORKS = {
    mainnet: {
        name: 'BNB Smart Chain',
        chainId: 56,
        rpcUrl: 'https://bsc-dataseed.binance.org/',
        blockExplorer: 'https://bscscan.com',
        usdtAddress: '0x55d398326f99059fF775485246999027B3197955',
        nftAddress: '0xaEbAfCa968c845bD69206Ba3c61cFbf59D123A23'
    },
    testnet: {
        name: 'BSC Testnet',
        chainId: 97,
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        blockExplorer: 'https://testnet.bscscan.com',
        usdtAddress: '0x397e12962a9dCed668FD5b7B2bfAfE585bdad323',
        nftAddress: '0x1Aa8576342c2B99527C138a9537b227807323e3c'
    }
} as const

// 根据环境导出可用的网络
export const NETWORKS: { [key: string]: NetworkConfig } = isDevelopment
    ? ALL_NETWORKS
    : { mainnet: ALL_NETWORKS.mainnet }

// 默认网络：开发环境下可以使用测试网，生产环境强制使用主网
export const DEFAULT_NETWORK = isDevelopment
    ? (process.env.NEXT_PUBLIC_DEFAULT_NETWORK || 'mainnet')
    : 'mainnet'

console.log('Network Configuration:', {
    DEFAULT_NETWORK,
    availableNetworks: Object.keys(NETWORKS),
    currentNetwork: NETWORKS[DEFAULT_NETWORK]?.name,
    isTestnetAvailable: 'testnet' in NETWORKS
})

// 获取当前网络配置
export const getCurrentNetwork = () => {
    const network = NETWORKS[DEFAULT_NETWORK]
    if (!network) {
        console.error('Invalid network selected:', DEFAULT_NETWORK)
        return NETWORKS.mainnet
    }
    return network
}

// 检查是否是有效的网络
export const isValidNetwork = (network: string): boolean => {
    return network in NETWORKS
}