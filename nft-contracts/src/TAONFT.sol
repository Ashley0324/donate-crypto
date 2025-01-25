// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract TAONFT is ERC721, Ownable {
    using Strings for uint256;

    IERC20 public immutable usdt;
    address public immutable withdrawalAddress;
    uint256 private _nextTokenId;
    mapping(uint256 => uint256) public mintAmounts;
    string public constant IMAGE_URI = "ipfs://QmZFTnWLjPDMSzesTfxugFhsktVyf6i2GJstecAEXyqtYm?filename=taoai.png";

    event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 amount);

    constructor(address _usdt, address _withdrawalAddress) ERC721("TAO NFT", "TAO") Ownable(msg.sender) {
        require(_usdt != address(0), "Invalid USDT address");
        require(_withdrawalAddress != address(0), "Invalid withdrawal address");
        usdt = IERC20(_usdt);
        withdrawalAddress = _withdrawalAddress;
    }

    function mint(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        // Transfer USDT from user to withdrawal address directly
        require(usdt.transferFrom(msg.sender, withdrawalAddress, amount), "USDT transfer failed");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        mintAmounts[tokenId] = amount;

        emit NFTMinted(msg.sender, tokenId, amount);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        uint256 amount = mintAmounts[tokenId];
        string memory amountStr = (amount / 1e18).toString();

        bytes memory json = abi.encodePacked(
            '{"name": "TAO NFT #',
            tokenId.toString(),
            '", "description": "TAO AI Agent NFT - Donation Amount: ',
            amountStr,
            ' USDT", "image": "',
            IMAGE_URI,
            '", "attributes": [{"trait_type": "Donation Amount", "value": "',
            amountStr,
            ' USDT"}]}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(json)
            )
        );
    }
}