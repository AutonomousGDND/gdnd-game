import { Stage } from "@pixi/react";
import { ContextBridge } from "./ContextBridge";
import { MUDContext } from "../MUDContext";

export const PixiProvider = ({ children }: { children: JSX.Element }) => {
    return (
        <ContextBridge
            Context={MUDContext}
            render={(children) => (
                <Stage
                    options={{
                        width: window.innerWidth,
                        height: window.innerHeight,
                        resizeTo: window,
                    }}
                >
                    {children}
                </Stage>
            )}
        >
            {children}
        </ContextBridge>
    );
};
