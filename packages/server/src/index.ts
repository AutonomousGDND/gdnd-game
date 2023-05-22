import "dotenv/config";
import { Server, Socket } from "socket.io";
import { ethers } from "ethers";
import { IWorld__factory } from "../../contracts/types/ethers-contracts";
import worldsJson from "../../contracts/worlds.json";

const worlds = worldsJson as Partial<
    Record<string, { address: string; blockNumber?: number }>
>;
const WorldAbi = IWorld__factory.abi;

const CHAIN_ID = process.env.CHAIN_ID ?? "31337";
const RPC = process.env.ETH_RPC ?? "http://127.0.0.1:8545";
const PORT = parseInt(process.env.PORT || "5000");
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
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
);
const contract = new ethers.Contract(world.address, WorldAbi, signer);

async function addTile(socket: Socket, x: number, y: number): Promise<void> {
    const tx = await contract.addRandomTile(x, y).catch((err: unknown) => {
        console.log("error", err);
        socket.emit("error", `Cannot add tile at coordinates ${x}/${y}`);
        return null;
    });
    if (tx !== null) {
        socket.emit("TransactionResult", tx.hash);
    }
}

async function main() {
    console.log("Server listening");
}

io.on("connection", (socket) => {
    console.log(`Socket connected ${socket.id}`);
    socket.on("add-tile", async ({ x, y }) => {
        addTile(socket, x, y);
    });
});
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
