import { createContext, useReducer } from "react";
import socketClient from "socket.io-client";

function reducer(state, { type, payload }) {
    switch (type) {
        default:
            return state;
    }
}

const initialState = {
    socket: process.env.NODE_ENV === "development" ?
        socketClient("http://localhost:8000") :
        socketClient("http://localhost:8000")
};

export const StateContext = createContext(initialState);

export const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StateContext.Provider value={{ state, dispatch }}>
            {children}
        </StateContext.Provider>
    )
}