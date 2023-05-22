import "dotenv/config";
import { Server } from "socket.io";
import { ethers } from "ethers";
import { IWorld__factory } from "../../contracts/types/ethers-contracts";
import worldsJson from "../../contracts/worlds.json";

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
    contract.addRandomTile(x, y).catch((e: unknown) => {
        console.log('Could not add tile');
        console.error(e);
    });
}

async function main() {
    console.log("Server listening");
}

io.on("connection", (socket) => {
    console.log(`Socket connected ${socket.id}`);
    socket.on("add-tile", async ({ x, y }) => {
        addTile(x, y);
    });
});
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
