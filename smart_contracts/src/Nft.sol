// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract SVGNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    mapping(uint256 => string) public tokenImg;

    event CreatedSVGNFT(uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("SVG NFT", "SVGNFT") Ownable(msg.sender) {
        tokenCounter = 1;
    }

    function numImage(uint256 _num) public pure returns (string memory) {
        string memory color1;
        string memory color2;
        string memory color3;
        string memory frame;
        string memory text;

        if (_num == 1) {
            color1 = "FFD700";
            color2 = "F0E68C";
            color3 = "B8860B";
            frame = "FFD700";
            text = "1st Winner";
        } else if (_num == 2) {
            color1 = "a7bdaeff";
            color2 = "a7beaeff";
            color3 = "a7bfaeff";
            frame = "777d7eff";
            text = "2nd RunnerUp";
        } else if (_num == 3) {
            color1 = "d38022ff";
            color2 = "d39522ff";
            color3 = "d39522ff";
            frame = "ca8300ff";
            text = "3rd Prize";
        } else {
            color1 = "ffffff";
            color2 = "ffffff";
            color3 = "ffffff";
            frame = "000000";
            text = "Participation";
        }

        string memory svg = string.concat(
            '<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style="background-color:#111; font-family:\'Segoe UI\',\'Roboto\',sans-serif;">',
            '<defs>',
                '<filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">',
                    '<feGaussianBlur stdDeviation="8" result="coloredBlur" in="SourceGraphic"/>',
                    '<feMerge>',
                        '<feMergeNode in="coloredBlur"/>',
                        '<feMergeNode in="SourceGraphic"/>',
                    '</feMerge>',
                '</filter>',
                '<linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">',
                    '<stop offset="0%" style="stop-color:#',color1,'; stop-opacity:1"/>',
                    '<stop offset="50%" style="stop-color:#',color2,'; stop-opacity:1"/>',
                    '<stop offset="100%" style="stop-color:#',color3,'; stop-opacity:1"/>',
                '</linearGradient>',
            '</defs>',
            '<g>',
                '<rect x="20" y="20" width="360" height="360" rx="30" ry="30" fill="#1a1a1a" stroke="#222" stroke-width="2"/>',
                '<rect x="20" y="20" width="360" height="360" rx="30" ry="30" fill="none" stroke="url(#gold-gradient)" stroke-width="8" filter="url(#glow-filter)"/>',
                '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#',frame,'" font-size="32" font-weight="bold" letter-spacing="1">',text,'</text>',
            '</g>',
            '</svg>'
        );

        return svg;
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

    function update(uint256 _tokenId, string memory svg) public {
        string memory imageURI = svgToImageURI(svg);
        _setTokenURI(_tokenId, formatTokenURI(imageURI));
        tokenImg[_tokenId] = svg;
    }

    function formatTokenURI(string memory imageURI) public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"Game NFT", "description":"An NFT for your Active Participation in the Game!", "image":"',
                            imageURI,
                            '"}'
                        )
                    )
                )
            )
        );
    }



}
