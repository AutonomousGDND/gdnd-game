import "dotenv/config";
import { Server } from "socket.io";
import { ContractReceipt, ethers } from "ethers";
import { IWorld__factory } from "../../contracts/types/ethers-contracts";
import worldsJson from "../../contracts/worlds.json";
import Jimp from "jimp";
// @ts-ignore
import { SimpleTiledModel } from "./lib/wfc";
import { tileData } from "./lib/simple-tiled-model-data";

if (!process.env.PRIVATE_KEY || !process.env.PORT || !process.env.CHAIN_ID) {
    throw new Error("Missing environment variables");
}

const worlds = worldsJson as Partial<
    Record<string, { address: string; blockNumber?: number }>
>;
const WorldAbi = IWorld__factory.abi;

const CHAIN_ID = process.env.CHAIN_ID;
const RPC = process.env.ETH_RPC;
const PORT = parseInt(process.env.PORT);
const io = new Server(PORT, {
    cors: {
        origin: "*",
    },
});

const world = worlds[CHAIN_ID];
if (!world) {
    throw new Error("World not found");
}
const provider = new ethers.providers.JsonRpcProvider(RPC);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(world.address, WorldAbi, signer);

async function addTile(
    x: number,
    y: number,
    tileType: number
): Promise<ContractReceipt | null> {
    try {
        const tx = await contract.addTile(x, y, 1, tileType);
        return tx.wait();
    } catch (err) {
        console.log("err", err);
        return null;
    }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
    for (const tile of tileData.tiles) {
        const image = await Jimp.read(`src/models/${tile.name}.png`);
        if (tile.symmetry === "X") {
            tile.bitmap = [image.bitmap];
        } else {
            tile.bitmap = [
                image.bitmap,
                image.bitmap,
                image.bitmap,
                image.bitmap,
            ];
        }
    }
    const width = 200;
    const height = 200;
    const model = new SimpleTiledModel(tileData, null, width, height, 0);
    let x = 0;
    let y = 0;
    io.on("connection", (socket) => {
        console.log(`Socket connected ${socket.id}`);
        socket.on("add-tile", async ({ x, y }) => {
            addTile(x, y, 1);
        });
    });
    const pixels = Array(width * height * 36).fill(0);
    const mytiles: Record<string, boolean> = {};
    while (x * y < 100) {
        await delay(1000);
        model.walk(x, y);
        model.graphics(pixels);

        const waves: Array<boolean[]> = model.wave || [];
        for (let index = 0; index < waves.length; index++) {
            if (waves[index].filter(Boolean).length !== 1) {
                continue;
            }
            const tileType = tileMaps[waves[index].findIndex(Boolean)];
            for (let i = 0; i < tileType.length; i++) {
                const x = index % width;
                const y = Math.floor(index / width);
                if (!mytiles[`${x}-${y}`]) {
                    const receipt = await addTile(x, y, tileType[i]);
                    mytiles[`${x}-${y}`] = true;
                }
            }
        }
        if (Math.random() < 0.5) {
            x++;
        } else {
            y++;
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

// representation of 3x3 wave collapse tiles
const tileMaps = [
    // bend
    [1, 0, 0, 1, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 1, 0, 0],
    [1, 1, 1, 0, 0, 1, 0, 0, 1],
    [0, 0, 1, 0, 0, 1, 1, 1, 1],
    // corner
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],

    // coridor
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 1, 0, 1, 0],

    // T
    [1, 1, 1, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 1],
    [0, 1, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 0, 0],

    // CUBE
    [1, 1, 1, 1, 1, 1, 1, 1, 1],

    // floor
    [0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 1],

    // small t
    [0, 0, 0, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 1, 0],

    // turn
    [0, 1, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 1, 1, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 0, 0, 0, 0],

    // the void
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];
