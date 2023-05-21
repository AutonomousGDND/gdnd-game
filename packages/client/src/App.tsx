import { PixiProvider } from "./components/PixiProvider";
import { Grid } from "./components/Grid";
import listenOnChain from "./datasource/onchainEvents";

export const App = () => {
    listenOnChain();
    return (
        <div>
            <PixiProvider>
                <Grid />
            </PixiProvider>
        </div>
    );
};
