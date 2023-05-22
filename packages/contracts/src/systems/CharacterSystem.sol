// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import {
    Position,
    PositionTableId,
    PositionData,
    Health,
    HealthData,
    Damage,
    Tile,
    Greed,
    Exhaustion,
    Hunger,
    Species,
    Armor,
    Damage
} from "../codegen/Tables.sol";
import { TileType } from "../codegen/Types.sol";

import { addressToEntity } from "../Utils.sol";
import { Direction, CharacterSpecies } from "../codegen/Types.sol";

contract CharacterSystem is System {
    function spawn(int16 x, int16 y) public {
        TileType destinationTile = Tile.get(x, y, uint32(0));
        require(destinationTile == TileType.Ground, "Can only spawn on the ground");
        bytes32 player = addressToEntity(_msgSender());

        HealthData memory playerHealth = Health.get(player);
        require(playerHealth.current == 0, "Player cannot spawn");

        Position.set(player, x, y, 0);
        Health.set(player, HealthData({
            current: 100,
            max: 100
        }));
        Damage.set(player, 70);
        Greed.set(player, 100);
        Hunger.set(player, 50);
        Exhaustion.set(player, 50);
        Species.set(player, CharacterSpecies.Human);
    }

    function move(Direction direction) public {
        bytes32 player = addressToEntity(_msgSender());

        uint8 exhaustion = Exhaustion.get(player);
        require(exhaustion < 100, "Character is exhausted");
        PositionData memory existingPosition = Position.get(player);
        int16 x = existingPosition.x;
        int16 y = existingPosition.y;

        if (direction == Direction.Up) {
            y -= 1;
        } else if (direction == Direction.Down) {
            y += 1;
        } else if (direction == Direction.Left) {
            x -= 1;
        } else if (direction == Direction.Right) {
            x += 1;
        }

        bytes32[] memory playersAtPosition = getKeysWithValue(PositionTableId, Position.encode(x, y, 0));

        Position.set(player, x, y, 0);
    }
}