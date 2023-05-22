import {Direction} from "../mud/createSystemCalls";

export {}
declare global {
    interface Window {
        addRandomTile: (x: number, y: number) => Promise<void>
        spawnPlayer: (x: number, y: number) => Promise<void>
        move: (d: Direction) => Promise<void>
    }
}