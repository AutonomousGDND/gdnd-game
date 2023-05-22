import { MUDContext } from "../MUDContext";
import { SocketContext, SocketProvider, useSocket } from "../contexts/socket";
import { type Context, ReactNode } from "react";

type ContextBridge = {
    children: JSX.Element;
    Context: typeof MUDContext;
    render(children: JSX.Element): ReactNode;
};

export const ContextBridge = ({ children, Context, render }: ContextBridge) => {
    const socket = useSocket();
    return (
        <Context.Consumer>
            {(value) =>
                render(
                    <Context.Provider value={value}>
                        <SocketProvider>{children}</SocketProvider>
                    </Context.Provider>
                )
            }
        </Context.Consumer>
    );
};
