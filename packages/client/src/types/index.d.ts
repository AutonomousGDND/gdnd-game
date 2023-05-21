export {}
declare global {
    interface Window {
        addRandomTile: (x: number, y: number) => Promise<void>
    }
}