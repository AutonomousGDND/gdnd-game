// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Tile } from "../codegen/Tables.sol";
import { TileType } from "../codegen/Types.sol";

/**
 * Map generation rules:
 *  - Ground can be anywhere
 *  - Wall needs to have at least one ground and one wall next to it
 *  - Door needs a wall on 2 opposite sides (up AND down || left AND right) and ground on the 2 others
 */
contract ExploreSystem is System {

    function _getRandomTile() internal view returns (TileType) {
        return TileType((block.difficulty % 4) + 1);
    }

    function addRandomTile(int8 x, int8 y) public {
        TileType tile = _getRandomTile();
        TileType exstisting = Tile.get(x, y, uint32(0));
        if (exstisting != TileType.Fog) {
            revert();
        }
        Tile.set(x, y, uint32(0), tile);
    }
}
