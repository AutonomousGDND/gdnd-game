import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

// move this somewhere eventually
export enum Direction {
    Up,
    Left,
    Right,
    Down,
}

export function createSystemCalls({ worldSend }: SetupNetworkResult) {
    const addRandomTile = async (x: number, y: number) => {
        worldSend("addRandomTile", [x, y]);
    };

    const spawnPlayer = async (x: number, y: number) => {
        worldSend("spawn", [x, y]);
    };

    const move = async (direction: Direction) => {
        worldSend("move", [direction]);
    };

    return {
        addRandomTile,
        spawnPlayer,
        move,
    };
}
