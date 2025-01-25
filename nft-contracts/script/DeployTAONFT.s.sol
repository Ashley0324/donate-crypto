// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {TAONFT} from "../src/TAONFT.sol";

contract DeployTAONFT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdtAddress = vm.envAddress("USDT_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        TAONFT nft = new TAONFT(usdtAddress);

        vm.stopBroadcast();
    }
}