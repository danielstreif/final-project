import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getFriendList,
    acceptRequest,
    unfriend,
    resetFriendRequests,
} from "../redux/actions";
import ProfilePic from "../components/profilePic";
import { Button, List, ListItem } from "@material-ui/core";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) => state.users && state.users.filter((user) => user.accepted)
    );
    const requests = useSelector(
        (state) =>
            state.users &&
            state.users.filter(
                (user) => !user.accepted && user.sender_id != state.idSelf
            )
    );
    const pending = useSelector(
        (state) =>
            state.users &&
            state.users.filter(
                (user) => !user.accepted && user.sender_id == state.idSelf
            )
    );

    useEffect(() => {
        dispatch(getFriendList());
        dispatch(resetFriendRequests());
    }, []);

    if (!friends || !requests || !pending) {
        return <p>Loading</p>;
    }

    const userList = (group, buttonArr) => (
        <List className="user-list">
            {group.map((user) => (
                <ListItem className="user-container" key={user.id}>
                    <Link className="user-link" to={`/users/${user.id}`}>
                        <div className="friend-profile-pic">
                            <ProfilePic props={user} />
                        </div>
                        <p>{`${user.first} ${user.last}`}</p>
                        {buttonArr.map((button, index) => (
                            <Button
                                key={index}
                                className="friend-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(button.action(user.id));
                                }}
                            >
                                {button.text}
                            </Button>
                        ))}
                    </Link>
                </ListItem>
            ))}
        </List>
    );

    return (
        <>
            <h2>Open Friend Requests</h2>
            <div className="user-group-container">
                {!requests.length && <p>No open requests</p>}
                {!!requests.length &&
                    userList(requests, [
                        { action: acceptRequest, text: "Accept" },
                        { action: unfriend, text: "Decline" },
                    ])}
            </div>
            <h2>Friends</h2>
            <div className="user-group-container">
                {!friends.length && (
                    <p>Send out friend requests to connect with people!</p>
                )}
                {!!friends.length &&
                    userList(friends, [{ action: unfriend, text: "Unfriend" }])}
            </div>
            <h2>Pending Friend Requests</h2>
            <div className="user-group-container">
                {!pending.length && <p>No pending requests</p>}
                {!!pending.length &&
                    userList(pending, [{ action: unfriend, text: "Cancel" }])}
            </div>
        </>
    );
}
