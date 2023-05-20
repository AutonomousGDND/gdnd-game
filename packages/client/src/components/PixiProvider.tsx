import { Stage } from "@pixi/react";

export const PixiProvider = ({ children }: { children: JSX.Element }) => {
    return (
        <Stage
            options={{
                width: window.innerWidth,
                height: window.innerHeight,
                resizeTo: window,
            }}
        >
            {children}
        </Stage>
    );
};
