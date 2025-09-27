// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract SVGNFT is ERC721URIStorage, Ownable {
    event CreatedSVGNFT(uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("SVG NFT", "SVGNFT") Ownable(msg.sender) {
        tokenCounter = 1;
    }

    function create(uint256 nft) public {
        _safeMint(msg.sender, tokenCounter);
        string memory svg = numImage(nft);
        update(tokenCounter, svg);
        emit CreatedSVGNFT(tokenCounter, svg);
        tokenCounter++;
    }

    function svgToImageURI(string memory svg) public pure returns (string memory) {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(bytes(svg));
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }
    
}
