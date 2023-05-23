import "dotenv/config";
import { Server } from "socket.io";
import { ethers } from "ethers";
import { IWorld__factory } from "../../contracts/types/ethers-contracts";
import worldsJson from "../../contracts/worlds.json";
import Jimp from "jimp";
// @ts-ignore
import { SimpleTiledModel } from './lib/wfc';
import { tileData } from "./lib/simple-tiled-model-data";

if (
    !process.env.PRIVATE_KEY ||
    !process.env.PORT ||
    !process.env.CHAIN_ID
) {
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
const signer = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    provider
);
const contract = new ethers.Contract(world.address, WorldAbi, signer);


function addTile(x: number, y: number): void {
    contract.addTile(x, y, 1, 1).catch((e: unknown) => {
        console.log('Could not add tile');
        console.error(e);
    });
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
    console.log(process.cwd());
    console.log("Server listening");
    for (const tile of tileData.tiles) {
        const image = await Jimp.read(`src/models/${tile.name}.png`);
        if (tile.symmetry === 'X') {
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
            addTile(x, y);
        });
    });
    const pixels = Array(width * height * 36).fill(0);
    while (x * y < 100) {
        await delay(1000);
        model.walk(x, y);
        model.graphics(pixels);
        const index = y * width * 36 + x * 36;
        const [r, g, b] = pixels.slice(index, index + 3);
        console.log({ r, g, b });

        // addTile(x, y);
        // console.log('Added tile', x, y);
        // if (Math.random() < 0.5) {
        //     x++;
        // } else {
        //     y++;
        // }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
