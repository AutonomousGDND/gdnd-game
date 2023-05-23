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

async function addTiles(
    x: number[],
    y: number[],
    tileType: number[]
): Promise<ContractReceipt | null> {
    try {
        const tx = await contract.addTiles(x, y, 1, tileType);
        return tx.wait();
    } catch (err) {
        console.log("err", err);
        return null;
    }
}

const discover = async (model: SimpleTiledModel, pixels: number[], mytiles: Record<string, boolean>, x: number, y: number) => {
    console.log('Discover', x, y);
    if (!model.wave) {
        model.initialize()
    }
    if (!model.wave) {
        return;
    }
    console.log('we made it');
    const before = model.wave.filter(
        possibilities => possibilities.filter(Boolean).length === 1
    ).map(cell => model.wave?.indexOf(cell));

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            model.walk(i, j);
        }
    }

    model.graphics(pixels);

    const after = model.wave.filter(
        possibilities => possibilities.filter(Boolean).length === 1
    ).map(cell => model.wave?.indexOf(cell));

    console.log({ before, after });
    const needsAdd = after.filter(t => before.indexOf(t) === -1);

    const xes = [];
    const ys = [];
    const types = [];
    for (let index = 0; index < model.wave.length; index++) {
        if (model.wave[index].filter(Boolean).length !== 1) {
            continue;
        }
        const tileType = tileMaps[model.wave[index].indexOf(true)];
        for (let i = 0; i < tileType.length; i++) {
            const x = index % model.FMX;
            const y = Math.floor(index / model.FMX);
            if (!mytiles[`${x}-${y}`]) {
                xes.push(x);
                ys.push(y);
                types.push(tileType[i]);
                mytiles[`${x}-${y}`] = true;
            }
        }
    }
    for (const index of needsAdd) {
        if (!index) continue;
        const x = index % model.FMX;
        const y = Math.floor(index / model.FMX);
        const tileType = tileMaps[model.wave[index].indexOf(true)];
        for (let i = 0; i < tileType.length; i++) {
            const x = index % model.FMX;
            const y = Math.floor(index / model.FMX);
            xes.push(x);
            ys.push(y);
            types.push(tileType[i]);
        }
    }
    console.log('AddTiles', { xes, ys, types });
    const receipt = await addTiles(xes, ys, types);
    console.log('AddTiles Receipt', receipt);
}

async function main(): Promise<void> {
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
    const pixels = Array(width * height * 36).fill(0);
    const mytiles: Record<string, boolean> = {};
    contract.on('StoreSetRecord', async (table, key, data) => {
        if (table !== '0x00000000000000000000000000000000506f736974696f6e0000000000000000') return;
        const bytes2Array = data.replace(/^0x/, '').match(/(.{4})/g);
        const x = parseInt(bytes2Array.shift(), 16);
        const y = parseInt(bytes2Array.shift(), 16);
        // const z = parseInt(bytes2Array.join(''), 16);
        await discover(model, pixels, mytiles, x, y);
    });
    // while (x * y < 100) {
    //     await delay(1000);
    //     await discover(model, pixels, mytiles, x, y);
    //     if (Math.random() < 0.5) {
    //         x++;
    //     } else {
    //         y++;
    //     }
    // }
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
