// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {TAONFT} from "../src/TAONFT.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WithdrawUSDT is Script {
    function run() external {
        // Load environment variables
        uint256 withdrawerPrivateKey = vm.envUint("PRIVATE_KEY");
        address nftAddress = vm.envAddress("NFT_CONTRACT_ADDRESS");

        // Get contract instances
        TAONFT nft = TAONFT(nftAddress);
        IERC20 usdt = IERC20(nft.usdt());

        // Start broadcasting transactions
        vm.startBroadcast(withdrawerPrivateKey);

        // Get initial balances
        uint256 initialBalance = usdt.balanceOf(nftAddress);
        console2.log("Initial USDT balance in contract:", initialBalance);

        // Withdraw USDT
        nft.withdrawUSDT();

        // Get final balances
        uint256 finalBalance = usdt.balanceOf(nftAddress);
        console2.log("Final USDT balance in contract:", finalBalance);
        console2.log("Withdrawn amount:", initialBalance - finalBalance);

        vm.stopBroadcast();
    }
}