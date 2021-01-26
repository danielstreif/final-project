import io from "socket.io-client";
import {
    receiveNewPrivateMessage,
    getOnlineUsers,
    messageSent,
    newFriendRequest,
} from "./redux/actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("users online", (userArr) => {
            store.dispatch(getOnlineUsers(userArr));
        });

        socket.on("friend request received", (userInfo) => {
            store.dispatch(newFriendRequest(userInfo));
        });

        socket.on("display sent message", (msg) => {
            store.dispatch(messageSent(msg));
        });

        socket.on("new message received", ({ msg, userId }) => {
            store.dispatch(receiveNewPrivateMessage(msg, userId));
        });
    }
};
