import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import ProfilePic from "../components/profilePic";
import { socket } from "../socket";
import {
    getPrivateMessages,
    sendPrivateMessage,
    getFriendList,
} from "../redux/actions";

import "./messages.css";

export default function Messages() {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) => state.users && state.users.filter((user) => user.accepted)
    );
    const onlineUsers = useSelector((state) => state && state.onlineUsers);
    const chatMessages = useSelector((state) => state && state.privateMessages);
    const userId = useSelector((state) => state && state.idSelf);
    const elemRef = useRef("");

    // dispatch(getPrivateMessages(otherId));

    useEffect(() => {
        dispatch(getFriendList());
    }, []);

    useEffect(() => {
        if (elemRef.current) {
            elemRef.current.scrollTop = elemRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // const handleKeyDown = (e) => {
    //     if (e.key === "Enter") {
    //         e.preventDefault();
    //         dispatch(sendPrivateMessage(e.target.value, otherId));
    //         e.target.value = null;
    //     }
    // };

    if (!friends) {
        return <p>Loading</p>;
    }

    console.log(onlineUsers);

    return (
        <>
            <h2>Friends</h2>
            <div className="user-group-container">
                {!friends.length && (
                    <p>Send out friend requests to connect with people!</p>
                )}
                {!!friends.length && (
                    <ul className="user-list">
                        {friends.map((friend) => (
                            <li className="user-container" key={friend.id}>
                                <Link
                                    className="user-link"
                                    to={`/users/${friend.id}`}
                                >
                                    <div className="friend-profile-pic">
                                        <ProfilePic props={friend} />
                                        {onlineUsers &&
                                            onlineUsers.some(
                                                (user) => user.id === friend.id
                                            ) && (<div className="status online"></div>)}
                                    </div>
                                    <p>{`${friend.first} ${friend.last}`}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* <h2 className="title">Private Chatroom</h2>
            <div className="outer-chat-container">
                <ul className="chat-container" ref={elemRef}>
                    {chatMessages.map((message) => (
                        <li className="chat-field" key={message.id}>
                            {message.user == userId && (
                                <div className="user-self">
                                    <span>{message.message}</span>
                                    <Link className="chat-user" to="/">
                                        <span className="user-info">
                                            <p>You</p>
                                            <p>{message.time}</p>
                                        </span>

                                        <div className="navbar-image">
                                            <ProfilePic
                                                first={message.first}
                                                last={message.last}
                                                url={message.url}
                                            />
                                        </div>
                                    </Link>
                                </div>
                            )}
                            {message.user != userId && (
                                <div className="user-other">
                                    <span>{message.message}</span>
                                    <Link
                                        className="chat-user"
                                        to={`/users/${message.user}`}
                                    >
                                        <div className="navbar-image">
                                            <ProfilePic
                                                first={message.first}
                                                last={message.last}
                                                url={message.url}
                                            />
                                        </div>
                                        <span className="user-info">
                                            <p>
                                                {message.first} {message.last}
                                            </p>
                                            <p>{message.time}</p>
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
            <Link className="chat-user" to={`/users/${otherId}`}>
                <button className="standard-button">Back</button>
            </Link> */}
        </>
    );
}
