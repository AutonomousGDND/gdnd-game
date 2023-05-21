import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    TileType: [
        'Ground',
        'Wall',
        'Door'
    ],
    Direction: [
        'Up',
        'Left',
        'Right',
        'Down'
    ]
  },
  tables: {
    PositionComponent: {
      schema: {
        x: 'int32',
        y: 'int32'
      },
    },
    GreedComponent: 'uint8',
    HungerComponent: 'uint8',
    StaminaComponent: 'uint8',
    BraveryComponent: 'uint8',
    HealthComponent: {
      schema: {
        current: 'uint16',
        max: 'uint16'
      }
    },
    DamageComponent: 'uint16',
    TileComponent: {
      keySchema: {
        x: 'int32',
        y: 'int32'
      },
      schema: {
        tile: 'TileType'
      }
    }
  },
  systems: {
    MoveSystem: {
      name: 'Move',
      openAccess: true
    },
    PickUpSystem: {
      name: 'PickUp',
      openAccess: true
    },
    ExploreSystem: {
      name: 'Explore',
      openAccess: true
    }
  },
  modules: [
    {
      name: "UniqueEntityModule",
      root: true,
      args: [],
    },
  ],
});
