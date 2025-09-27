// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {GameHub} from "../src/GameHub.sol";

contract GameHubScript is Script {
    GameHub public game;

    function setUp() public {}

    function run() public {
        address admin = 0x65d70c64d79ED44245b79F490A54b324e7751a6B;
        vm.startBroadcast();

        game = new GameHub(admin);

        vm.stopBroadcast();
    }
}

// forge script script/GameHub.s.sol --rpc-url $RPC --broadcast --private-key $PRIVATE_KEY