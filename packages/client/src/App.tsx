import { PixiProvider } from "./components/PixiProvider";
import { Grid } from "./components/Grid";

export const App = () => {
    return (
        <PixiProvider>
            <Grid />
        </PixiProvider>
    );
};
