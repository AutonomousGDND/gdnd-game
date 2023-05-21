import { MUDContext } from "../MUDContext";
import { SetupResult } from "../mud/setup";
import { type Context, ReactNode } from "react";

type ContextBridge = {
    children: JSX.Element;
    Context: typeof MUDContext;
    render(children: JSX.Element): ReactNode;
};

export const ContextBridge = ({ children, Context, render }: ContextBridge) => {
    return (
        <Context.Consumer>
            {(value) =>
                render(
                    <Context.Provider value={value}>
                        {children}
                    </Context.Provider>
                )
            }
        </Context.Consumer>
    );
};
