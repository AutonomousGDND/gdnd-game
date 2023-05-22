import { createContext, ReactNode, useContext } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);
const socket = io("ws://localhost:5000");

type Props = {
    children: ReactNode;
};

export const SocketProvider = ({ children }: Props) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
