import { useState, useEffect } from "react";
import axios from "../axios";
import { socket } from "../socket";
import { Button } from "@material-ui/core";

export default function FriendButton({ otherId }) {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        if (otherId !== undefined) {
            let abort;
            (async () => {
                const { data } = await axios.get(
                    `/friendships-status/${otherId}`
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

    const handleClick = (e, action) => {
        e.preventDefault();
        if (action == "Add Friend") {
            socket.emit("friend request", Number(otherId));
        }
        axios
            .post(`/friendships-action/${action}/${otherId}`)
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
            <Button
                variant="outlined"
                onClick={(e) => handleClick(e, buttonText)}
            >
                {buttonText}
            </Button>
            {buttonText === "Accept" && (
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={(e) => handleClick(e, "Decline")}
                >
                    Decline
                </Button>
            )}
        </>
    );
}
