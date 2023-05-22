import { PixiProvider } from "./components/PixiProvider";
import { Grid } from "./components/Grid";
import { Container } from "@pixi/react";
import { Controls } from "./components/Controls";

export const App = () => {
    return (
        <PixiProvider>
            <Container>
                <Grid />
                {/* Need to make things UNDER the controls not clickable somehow */}
                {/* <Controls /> */}
            </Container>
        </PixiProvider>
    );
};
