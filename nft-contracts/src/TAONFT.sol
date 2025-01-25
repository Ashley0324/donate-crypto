// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TAONFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    IERC20 public immutable usdt;
    mapping(uint256 => uint256) public mintAmounts;
    string public constant TOKEN_URI = "ipfs://QmZFTnWLjPDMSzesTfxugFhsktVyf6i2GJstecAEXyqtYm?filename=taoai.png";

    event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 amount);

    constructor(address _usdt) ERC721("TAO Private Placement", "TAO") Ownable(msg.sender) {
        usdt = IERC20(_usdt);
    }

    function mint(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        // Transfer USDT from user to contract
        require(usdt.transferFrom(msg.sender, owner(), amount), "USDT transfer failed");

        // Mint NFT
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        // Record mint amount
        mintAmounts[tokenId] = amount;

        emit NFTMinted(msg.sender, tokenId, amount);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        return TOKEN_URI;
    }
}