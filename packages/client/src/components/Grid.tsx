import "@pixi/events";
import { Sprite, useApp } from "@pixi/react";
import { Viewport } from "./PixiViewport";
import tileImage from "../tile.jpg";
import { useEffect } from "react";

// if this gets more complicated, we can export to it's own file. For now its fine.
const Tile = ({ tile }: { tile: TileProps }) => {
    return (
        <Sprite
            image={tileImage}
            position={[tile.x, tile.y]}
            scale={{ x: 0.1, y: 0.1 }}
            roundPixels={true}
        />
    );
};
type TileProps = {
    id: string;
    x: number;
    y: number;
};

// stub function just to get tiles on the screen. Will replace this with our world state
const createTiles = (count: number) => {
    const height = 55;
    const width = 55;

    const tiles = [];
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            if (Math.random() < 0.5) {
                tiles.push({ id: `${i}-${j}`, x: j * width, y: i * height });
            }
        }
    }
    return tiles;
};

export const Grid = () => {
    const app = useApp();

    useEffect(() => {
        // we have to run `resize` on app load in order for it to automatically resize to the window w/h
        // if we didn't run this, the app wouldn't be full screen until we mantually resized our window
        app.resize();
    }, [app]);

    return (
        <Viewport width={window.innerWidth} height={window.innerHeight}>
            {createTiles(20).map((tile) => (
                <Tile key={tile.id} tile={tile} />
            ))}
        </Viewport>
    );
};
