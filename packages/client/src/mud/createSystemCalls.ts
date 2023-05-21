import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls({ worldSend }: SetupNetworkResult) {
    const addRandomTile = async (x: number, y: number) => {
        worldSend("addRandomTile", [x, y]);
    };

    return {
        addRandomTile,
    };
}
