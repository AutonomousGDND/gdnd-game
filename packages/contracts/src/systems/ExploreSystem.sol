// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { TileComponent } from "../codegen/Tables.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";
import { TileType } from "../codegen/Types.sol";

contract ExploreSystem is System {

    function _getRandomTile() internal view returns (TileType) {
        return TileType((block.difficulty % 3) + 1);
    }
    function addRandomTile(int8 x, int8 y) public {
        TileType tile = _getRandomTile();
        TileType exstisting = TileComponent.get(x, y);
        if (exstisting != TileType.Fog) {
            revert();
        }
        TileComponent.set(x, y, tile);
    }
}
