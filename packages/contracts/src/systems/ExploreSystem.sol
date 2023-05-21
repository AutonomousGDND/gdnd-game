// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { TileComponent } from "../codegen/Tables.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

contract ExploreSystem is System {
    function addRandomTile(int8 x, int8 y) public {
        bytes32 id = getUniqueEntity();
        TileComponent.set(id, x, y, "bad.png");
    }
}
