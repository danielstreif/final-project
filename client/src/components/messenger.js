import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import { socket } from "../socket";

import "../app_components/messages.css";

export default function Messenger({ userId, otherId }) {
    const privateMessages = useSelector(
        (state) => state && state.privateMessages
    );
    const elemRef = useRef("");

    useEffect(() => {
        if (elemRef.current) {
            elemRef.current.scrollTop = elemRef.current.scrollHeight;
        }
    }, [privateMessages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (e.target.value) {
                socket.emit("new message outgoing", {
                    msg: e.target.value,
                    otherId: Number(otherId),
                });
                e.target.value = null;
            }
        }
    };

    const deleteMessage = (messageId) => {
        socket.emit("delete message", messageId);
    };

    return (
        <div className="messenger">
            <div className="outer-chat-container">
                <ul className="inner-chat-container" ref={elemRef}>
                    {privateMessages &&
                        privateMessages.map((message) => (
                            <li className="chat-field" key={message.id}>
                                {message.user == userId && (
                                    <div className="user-self">
                                        <span
                                            className={`message ${
                                                message.message ==
                                                "message deleted"
                                                    ? "deleted-message"
                                                    : ""
                                            }
                                            `}
                                        >
                                            {message.message}
                                        </span>
                                        <div className="chat-user">
                                            <span className="user-info">
                                                <span>You</span>
                                                {message.time}
                                                {message.message !=
                                                    "message deleted" && (
                                                    <img
                                                        className="delete-icon"
                                                        src="/img/bin.png"
                                                        alt="delete"
                                                        onClick={() =>
                                                            deleteMessage(
                                                                message.id
                                                            )
                                                        }
                                                    />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {message.user != userId && (
                                    <div className="user-other">
                                        <span
                                            className={`message ${
                                                message.message ==
                                                "message deleted"
                                                    ? "deleted-message"
                                                    : ""
                                            }
                                            `}
                                        >
                                            {message.message}
                                        </span>
                                        <Link
                                            className="chat-user"
                                            to={`/users/${message.user}`}
                                        >
                                            <span className="user-info">
                                                <span>
                                                    {message.first}{" "}
                                                    {message.last}
                                                </span>
                                                {message.time}
                                            </span>
                                        </Link>
                                    </div>
                                )}
                            </li>
                        ))}
                </ul>
            </div>
            <textarea
                className="chat-textarea"
                onKeyDown={handleKeyDown}
                placeholder="Compose Message"
            />
        </div>
    );
}
