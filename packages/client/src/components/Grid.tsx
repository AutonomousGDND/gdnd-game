import "@pixi/events";
import { Sprite, useApp } from "@pixi/react";
import { Viewport } from "./PixiViewport";
import tileImage from "../tile.jpg";
import NewDungeon from "random-dungeon-generator";
import { useEffect, useState } from "react";
import { useMUD } from "../MUDContext";
import { TileType } from "../mud/types";
import { useSocket } from "../contexts/socket";
import wall from "../wall.png";
import ground from "../ground.png";

const tileImages: Record<TileType, string> = {
    [TileType.Fog]: "",
    [TileType.Ground]: tileImage,
    [TileType.Wall]: tileImage,
    [TileType.Door]: tileImage,
    [TileType.LockedDoor]: tileImage,
};

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
        systemCalls: { addRandomTile, spawnPlayer, move },
    } = useMUD();
    // const tileIds = useEntityQuery([Has(Tile)]);
    const tileIds = [];
    const [tiles, setTiles] = useState<MapTileProps[]>([]);

    useEffect(() => {
        // we have to run `resize` on app load in order for it to automatically resize to the window w/h
        // if we didn't run this, the app wouldn't be full screen until we mantually resized our window
        app.resize();
        window.addRandomTile = addRandomTile;
        const options = {
            width: 50,
            height: 50,
            minRoomSize: 5,
            maxRoomSize: 20,
        };
        const dungeon = NewDungeon(options);
        const _tiles = [];
        for (let y = 0; y < dungeon.length; y++) {
            for (let x = 0; x < dungeon[y].length; x++) {
                console.log(dungeon[y][x]);
                _tiles.push({
                    x,
                    y,
                    backgroundImage: dungeon[y][x] === 1 ? wall : ground,
                });
            }
        }
        setTiles(_tiles);
        window.spawnPlayer = spawnPlayer;
        window.move = move;
    }, [app]);

    return (
        <Viewport width={window.innerWidth} height={window.innerHeight}>
            {tiles.map((tile) => {
                // const [x, y] = entityId
                //     .split(":")
                //     .map((n) => BigNumber.from(n).toNumber());
                // const { tile } = getComponentValueStrict(Tile, entityId);
                // const tileData = {
                //     x,
                //     y,
                //     type: tile as TileType,
                // };
                return <MapTile key={`${tile.x}-${tile.y}`} tile={tile} />;
            })}
        </Viewport>
    );
};
