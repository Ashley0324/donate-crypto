// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {TAONFT} from "../src/TAONFT.sol";
import {MockERC20} from "./mock/MockERC20.sol";

contract TAONFTTest is Test {
    TAONFT public nft;
    MockERC20 public usdt;
    address public withdrawalAddress;
    address public user;
    uint256 public constant MINT_AMOUNT = 1000 * 10**18;

    function setUp() public {
        usdt = new MockERC20();
        withdrawalAddress = makeAddr("withdrawalAddress");
        user = makeAddr("user");
        nft = new TAONFT(address(usdt), withdrawalAddress);

        // Mint USDT to user and approve NFT contract
        usdt.mint(user, MINT_AMOUNT);
        vm.prank(user);
        usdt.approve(address(nft), MINT_AMOUNT);
    }

    function test_Mint() public {
        uint256 userInitialBalance = usdt.balanceOf(user);
        uint256 withdrawalInitialBalance = usdt.balanceOf(withdrawalAddress);

        vm.prank(user);
        nft.mint(MINT_AMOUNT);

        // Check NFT was minted
        assertEq(nft.ownerOf(0), user);
        assertEq(nft.mintAmounts(0), MINT_AMOUNT);

        // Check USDT was transferred directly to withdrawal address
        assertEq(usdt.balanceOf(user), userInitialBalance - MINT_AMOUNT);
        assertEq(usdt.balanceOf(withdrawalAddress), withdrawalInitialBalance + MINT_AMOUNT);
        assertEq(usdt.balanceOf(address(nft)), 0); // Contract should never hold USDT
    }

    function test_RevertWhen_MintWithZeroAmount() public {
        vm.prank(user);
        vm.expectRevert("Amount must be greater than 0");
        nft.mint(0);
    }

    function test_RevertWhen_MintWithoutApproval() public {
        address newUser = makeAddr("newUser");
        usdt.mint(newUser, MINT_AMOUNT);

        vm.prank(newUser);
        vm.expectRevert();
        nft.mint(MINT_AMOUNT);
    }

    function test_RevertWhen_MintWithInsufficientBalance() public {
        address poorUser = makeAddr("poorUser");
        usdt.mint(poorUser, MINT_AMOUNT - 1);

        vm.prank(poorUser);
        usdt.approve(address(nft), MINT_AMOUNT);

        vm.prank(poorUser);
        vm.expectRevert();
        nft.mint(MINT_AMOUNT);
    }
}