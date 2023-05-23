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

//    address dungeonMaster = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    function addTile(int8 x, int8 y, uint32 z, TileType tile) public {
//        require(_msgSender() == dungeonMaster, "You are not the Dungeon Master");
        TileType exstisting = Tile.get(x, y, z);
        require(exstisting == TileType.Fog, "That tile was already discovered");
        Tile.set(x, y, z, tile);
    }

    function addTiles(int8[] calldata x, int8[] calldata y, uint32 z, TileType[] calldata tile) public {
        require(x.length == y.length && x.length == tile.length, "Inconsistent calldata size");
        for (uint256 i = 0; i < x.length; i++) {
            TileType exstisting = Tile.get(x[i], y[i], z);
            if (exstisting == TileType.Fog) {
                Tile.set(x[i], y[i], z, tile[i]);
            }
        }
    }
}
