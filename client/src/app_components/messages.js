import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import ProfilePic from "../components/profilePic";
import Messenger from "../components/messenger";
import { getPrivateMessages, getFriendList } from "../redux/actions";

import "./messages.css";

export default function Messages() {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) => state.users && state.users.filter((user) => user.accepted)
    );
    const onlineUsers = useSelector((state) => state && state.onlineUsers);

    const userId = useSelector((state) => state && state.idSelf);
    const messageNotification = useSelector(
        (state) => state && state.messageNotification
    );
    const [otherId, setOtherId] = useState();
    const [messengerActive, setMessenger] = useState(false);

    useEffect(() => {
        dispatch(getFriendList());
    }, []);

    const startPrivateMessage = (id) => {
        setOtherId(id);
        setMessenger(true);
        dispatch(getPrivateMessages(id));
    };

    const friendList = () => {
        return (
            <ul className="user-list">
                {friends.map((friend) => (
                    <li className="user-container" key={friend.id}>
                        <button onClick={() => startPrivateMessage(friend.id)}>
                            <div className="friend-profile-pic">
                                <ProfilePic props={friend} />
                                {onlineUsers &&
                                    onlineUsers.some(
                                        (user) => user.id === friend.id
                                    ) && <div className="status online"></div>}
                                {messageNotification &&
                                    onlineUsers &&
                                    onlineUsers.some(
                                        (user) => user.id == messageNotification
                                    ) && (
                                        <div className="message-note">
                                            new message
                                        </div>
                                    )}
                            </div>
                            <p>{`${friend.first} ${friend.last}`}</p>
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    if (!friends) {
        return <p>Loading</p>;
    }

    return (
        <>
            <h2>Messages</h2>
            <div className="page-container">
                <div className="user-group-container">
                    {!friends.length && (
                        <p>Send out friend requests to connect with people!</p>
                    )}
                    {!!friends.length && friendList()}
                </div>
                {messengerActive && (
                    <Messenger userId={userId} otherId={otherId} />
                )}
            </div>
        </>
    );
}
