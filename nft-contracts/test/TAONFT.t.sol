// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {TAONFT} from "../src/TAONFT.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
    constructor() ERC20("Mock USDT", "USDT") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract TAONFTTest is Test {
    TAONFT public nft;
    MockUSDT public usdt;
    address public user;
    address public owner;

    function setUp() public {
        owner = makeAddr("owner");
        vm.startPrank(owner);
        usdt = new MockUSDT();
        nft = new TAONFT(address(usdt));
        vm.stopPrank();

        user = makeAddr("user");
        vm.deal(user, 1 ether);
        vm.startPrank(owner);
        usdt.transfer(user, 1000 * 10**18);
        vm.stopPrank();
    }

    function test_Mint() public {
        uint256 amount = 100 * 10**18;
        uint256 ownerInitialBalance = usdt.balanceOf(owner);

        vm.startPrank(user);
        usdt.approve(address(nft), amount);
        nft.mint(amount);
        vm.stopPrank();

        assertEq(nft.balanceOf(user), 1);
        assertEq(nft.mintAmounts(0), amount);
        assertEq(usdt.balanceOf(owner), ownerInitialBalance + amount);
    }

    function test_RevertWhen_ZeroAmount() public {
        vm.startPrank(user);
        vm.expectRevert("Amount must be greater than 0");
        nft.mint(0);
        vm.stopPrank();
    }

    function test_RevertWhen_InsufficientAllowance() public {
        uint256 amount = 100 * 10**18;

        vm.startPrank(user);
        // Don't approve USDT
        vm.expectRevert();  // Just expect any revert since the message might vary
        nft.mint(amount);
        vm.stopPrank();
    }

    function test_TokenURI() public {
        uint256 amount = 100 * 10**18;

        vm.startPrank(user);
        usdt.approve(address(nft), amount);
        nft.mint(amount);

        string memory expectedURI = "ipfs://QmZFTnWLjPDMSzesTfxugFhsktVyf6i2GJstecAEXyqtYm?filename=taoai.png";
        assertEq(nft.tokenURI(0), expectedURI);
        vm.stopPrank();
    }
}