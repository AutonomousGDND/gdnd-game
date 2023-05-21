import { PixiProvider } from "./components/PixiProvider";
import { Grid } from "./components/Grid";

export const App = () => {
    return (
        <div>
            <PixiProvider>
                <Grid />
            </PixiProvider>
        </div>
    );
};
