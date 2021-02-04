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
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    friendButton: {
        marginRight: "5px",
    },
}));

export default function Friends() {
    const dispatch = useDispatch();
    const { friendButton } = useStyles();
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
        <ul className="user-list">
            {group.map((user) => (
                <li className="user-container" key={user.id}>
                    <Link to={`/users/${user.id}`}>
                        <div className="friend-profile-pic">
                            <ProfilePic props={user} />
                        </div>
                        <p>{`${user.first} ${user.last}`}</p>
                        {buttonArr.map((button, index) => (
                            <Button
                                className={friendButton}
                                variant="outlined"
                                key={index}
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(button.action(user.id));
                                }}
                            >
                                {button.text}
                            </Button>
                        ))}
                    </Link>
                </li>
            ))}
        </ul>
    );

    return (
        <>
            <h2>Open Friend Requests</h2>
            <div className="user-group-container">
                {!requests.length && (
                    <p className="error-message">No open requests</p>
                )}
                {!!requests.length &&
                    userList(requests, [
                        { action: acceptRequest, text: "Accept" },
                        { action: unfriend, text: "Decline" },
                    ])}
            </div>
            <h2>Friends</h2>
            <div className="user-group-container">
                {!friends.length && (
                    <p className="error-message">
                        Send out friend requests to connect with people!
                    </p>
                )}
                {!!friends.length &&
                    userList(friends, [{ action: unfriend, text: "Unfriend" }])}
            </div>
            <h2>Pending Friend Requests</h2>
            <div className="user-group-container">
                {!pending.length && (
                    <p className="error-message">No pending requests</p>
                )}
                {!!pending.length &&
                    userList(pending, [{ action: unfriend, text: "Cancel" }])}
            </div>
        </>
    );
}
