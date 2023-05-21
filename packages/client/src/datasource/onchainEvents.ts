import { getNetworkConfig } from '../mud/getNetworkConfig';
import { ContractTransaction, ethers, Event} from 'ethers';

type MudEventHandler = (ev: Event) => void;

export default async function listenOnChain(eventHandler: MudEventHandler): Promise<void> {
    const { provider, worldAddress } = await getNetworkConfig();
    const rpc = new ethers.providers.JsonRpcProvider(provider.jsonRpcUrl);

    rpc.on('block', async (blockNumber) => {
        const block = await rpc.getBlockWithTransactions(blockNumber);
        for (const tx of block.transactions) {
            if (tx.to !== worldAddress) continue;
            const { events } = await (tx as ContractTransaction).wait();
            if (!events) continue; // <-- will always be true for now because we need the ABI for the contract for this field to be populated
            for (const event of events) {
                eventHandler(event);
            }
        }
        console.log('Block', block);
    });
}
