import "@pixi/events";
import { Sprite, useApp } from "@pixi/react";
import { Viewport } from "./PixiViewport";
import { useEffect } from "react";
import { useEntityQuery } from "@latticexyz/react";
import { useMUD } from "../MUDContext";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { BigNumber } from "ethers";
import { useSocket } from "../contexts/socket";
import wall from "../wall.png";
import ground from "../ground.png";

const TILE_SIZE = 16;
// if this gets more complicated, we can export to it's own file. For now its fine.
const MapTile = ({ tile }: { tile: MapTileProps }) => {
    const socket = useSocket();
    return (
        <Sprite
            pointerdown={() => {
                console.log("socket", socket);
                socket?.emit("add-tile", { x: tile.x + 1, y: tile.y + 1 });
            }}
            interactive
            image={tile.backgroundImage}
            position={[tile.x * TILE_SIZE, tile.y * TILE_SIZE]}
            scale={{ x: 1, y: 1 }}
            roundPixels={true}
        />
    );
};
type MapTileProps = {
    x: number;
    y: number;
    backgroundImage: string;
};

export const Grid = () => {
    const app = useApp();
    const {
        components: { Tile },
        systemCalls: { spawnPlayer, move },
    } = useMUD();
    // const tileIds = useEntityQuery([Has(Tile)]);
    const tileIds = useEntityQuery([Has(Tile)]);

    useEffect(() => {
        // we have to run `resize` on app load in order for it to automatically resize to the window w/h
        // if we didn't run this, the app wouldn't be full screen until we mantually resized our window
        app.resize();
        window.spawnPlayer = spawnPlayer;
        window.move = move;
    }, [app]);

    return (
        <Viewport width={window.innerWidth} height={window.innerHeight}>
            {tileIds.map((entityId) => {
                const [x, y] = entityId
                    .split(":")
                    .map((n: string) => BigNumber.from(n).toNumber());
                const { tile } = getComponentValueStrict(Tile, entityId);
                const backgroundImage = tile === 1 ? ground : wall;
                const tileData = {
                    x,
                    y,
                    backgroundImage,
                };
                return <MapTile key={entityId} tile={tileData} />;
            })}
        </Viewport>
    );
};
