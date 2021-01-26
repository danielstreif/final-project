import { useState, useEffect } from "react";
import axios from "../axios";
import { socket } from "../socket";

export default function FriendButton({ otherId }) {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        if (otherId !== undefined) {
            let abort;
            (async () => {
                const { data } = await axios.get(
                    `/friendship-status/${otherId}`
                );
                if (!abort) {
                    if (data.success) {
                        return setButtonText(data.success);
                    }
                }
            })();
            return () => {
                abort = true;
            };
        }
    }, [otherId]);

    const handleClick = (e) => {
        e.preventDefault();
        const action = e.target.value;
        if (action == "Add Friend") {
            socket.emit("friend request", Number(otherId));
        }
        axios
            .post(`/friendship-action/${action}/${otherId}`)
            .then(({ data }) => {
                if (data.success) {
                    setButtonText(data.success);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <button
                className="friend-button"
                value={buttonText}
                onClick={handleClick}
            >
                {buttonText}
            </button>
            {buttonText === "Accept" && (
                <button
                    className="friend-button"
                    value="Decline"
                    onClick={handleClick}
                >
                    Decline
                </button>
            )}
        </>
    );
}
