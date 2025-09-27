// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {SVGNFT} from "../src/Nft.sol";

contract CounterScript is Script {
    SVGNFT public counter;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        counter = new SVGNFT();

        counter.create(1);

        counter.create(2);

         counter.update(1,"<svg width='500' height='500' viewBox='0 0 285 350' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill='black' d='M150,0,L75,200,L225,200,Z'></path></svg>");
     
        vm.stopBroadcast();
    }
}
