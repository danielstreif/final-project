import io from "socket.io-client";
import { getMessages, newMessage, getOnlineUsers } from "./redux/actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("users online", (userArr) => {
            store.dispatch(getOnlineUsers(userArr));
        });

        // socket.on("get messages", (msgs, userId) => {
        //     store.dispatch(getMessages(msgs, userId));
        // });

        // socket.on("new message and user", (msg) => {
        //     store.dispatch(newMessage(msg));
        // });
    }
};
