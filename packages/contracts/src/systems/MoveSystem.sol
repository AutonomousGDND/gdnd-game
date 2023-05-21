// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

contract MoveSystem is System {
    function move() public returns (int32) {
        return int32(5);
    }
}
