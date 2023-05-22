import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    TileType: ["Fog", "Ground", "Wall", "Door", "LockedDoor"],
    Direction: ["Up", "Left", "Right", "Down"],
    CharacterSpecies: ["Sprite", "Goblin", "Dwarf", "Dragon", "Human"]
  },
  tables: {
    Position: {
      schema: {
        x: "int16",
        y: "int16",
        z: "uint32"
      },
    },
    Greed: "uint8",
    Hunger: "uint8",
    Bravery: "uint8",
    Exhaustion: "uint8",
    Health: {
      schema: {
        current: "uint16",
        max: "uint16",
      },
    },
    Species: "CharacterSpecies",
    Damage: "uint16",
    Armor: "uint16",
    Tile: {
      keySchema: {
        x: "int16",
        y: "int16",
        z: "uint32"
      },
      schema: {
        tile: "TileType",
      },
    },
  },
  systems: {
    MoveSystem: {
      name: "Move",
      openAccess: true,
    },
    PickUpSystem: {
      name: "PickUp",
      openAccess: true,
    },
    ExploreSystem: {
      name: "Explore",
      openAccess: true,
    },
  },
});
