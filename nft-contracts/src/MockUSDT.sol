// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
    uint8 private immutable _decimals;

    constructor() ERC20("Mock USDT", "USDT") {
        _decimals = 18;
        // 铸造 1000000 USDT 给部署者
        _mint(msg.sender, 1000000 * 10**_decimals);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    // 用于测试的铸造函数
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}