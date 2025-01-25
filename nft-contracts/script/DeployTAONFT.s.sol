// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {TAONFT} from "../src/TAONFT.sol";

contract DeployTAONFT is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdtAddress = vm.envAddress("USDT_ADDRESS");
        address withdrawalAddress = vm.envAddress("WITHDRAWAL_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        TAONFT nft = new TAONFT(usdtAddress, withdrawalAddress);

        console2.log("NFT contract deployed at:", address(nft));
        console2.log("USDT contract address:", usdtAddress);
        console2.log("Withdrawal address:", withdrawalAddress);

        vm.stopBroadcast();
    }
}