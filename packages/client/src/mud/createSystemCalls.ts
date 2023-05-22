import { SetupNetworkResult } from "./setupNetwork";
import { Direction } from "./types";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

// move this somewhere eventually

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
