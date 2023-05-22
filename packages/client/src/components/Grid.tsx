import "@pixi/events";
import { Sprite, useApp } from "@pixi/react";
import { Viewport } from "./PixiViewport";
import tileImage from "../tile.jpg";
import { useEffect } from "react";
import { useEntityQuery } from "@latticexyz/react";
import { useMUD } from "../MUDContext";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { BigNumber } from "ethers";
import TileType from "../types/TileType";
import { useSocket } from "../contexts/socket";

const tileImages: Record<TileType, string> = {
    [TileType.Fog]: "",
    [TileType.Ground]: tileImage,
    [TileType.Wall]: tileImage,
    [TileType.Door]: tileImage,
    [TileType.LockedDoor]: tileImage
};

const TILE_SIZE = 55;
// if this gets more complicated, we can export to it's own file. For now its fine.
const Tile = ({ tile }: { tile: TileProps }) => {
    const socket = useSocket();
    return (
        <Sprite
            pointerdown={() => {
                console.log("socket", socket);
                socket?.emit("add-tile", { x: tile.x + 1, y: tile.y + 1 });
            }}
            interactive
            image={tileImages[tile.type]}
            position={[tile.x * TILE_SIZE, tile.y * TILE_SIZE]}
            scale={{ x: 0.1, y: 0.1 }}
            roundPixels={true}
        />
    );
};
type TileProps = {
    x: number;
    y: number;
    type: TileType;
};

export const Grid = () => {
    const app = useApp();
    const {
        components: { TileComponent },
        systemCalls: { addRandomTile },
    } = useMUD();
    const tileIds = useEntityQuery([Has(TileComponent)]);

    useEffect(() => {
        // we have to run `resize` on app load in order for it to automatically resize to the window w/h
        // if we didn't run this, the app wouldn't be full screen until we mantually resized our window
        app.resize();
        window.addRandomTile = addRandomTile;
    }, [app]);

    return (
        <Viewport width={window.innerWidth} height={window.innerHeight}>
            {tileIds.map((entityId) => {
                const [x, y] = entityId
                    .split(":")
                    .map((n) => BigNumber.from(n).toNumber());
                console.log({ x, y });
                const { tile } = getComponentValueStrict(
                    TileComponent,
                    entityId
                );
                const tileData = {
                    x,
                    y,
                    type: tile as TileType,
                };
                return <Tile key={entityId} tile={tileData} />;
            })}
        </Viewport>
    );
};
