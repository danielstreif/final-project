import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOtherUser } from "../redux/actions";
import ProfilePic from "../components/profilePic";
import FriendButton from "../components/friendButton";

export default function OtherProfile(props) {
    const dispatch = useDispatch();
    const otherUser = useSelector((state) => state.otherUser);
    const activeUser = useSelector((state) => state.activeUser);

    useEffect(() => {
        const otherId = props.match.params.id;
        if (otherId === activeUser.id) {
            return props.history.push("/");
        }
        dispatch(getOtherUser(otherId));
    }, []);

    if (!otherUser.id) {
        return null;
    }

    return (
        <div className="profile-container">
            <div className="profile-container-left">
                <h2>
                    {otherUser.first} {otherUser.last}
                </h2>
                <div className="bio-profile-pic">
                    <ProfilePic props={otherUser} />
                </div>
                <p className="bio-text">{otherUser.bio}</p>
                <FriendButton otherId={otherUser.id} />
            </div>
            <div className="profile-container-right">
                <p>map and gallery?</p>
            </div>
        </div>
    );
}
