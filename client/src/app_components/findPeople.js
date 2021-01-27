import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";
import ProfilePic from "../components/profilePic";
import FriendButton from "../components/friendButton";
import { Input, List, ListItem } from "@material-ui/core";

export default function FindPeople() {
    const [query, setQuery] = useState();
    const [users, setUser] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        let abort;
        (async () => {
            const { data } = await axios.get(`/user/search/?q=${query}`);
            if (!abort) {
                if (data.error) {
                    return setError(true);
                } else {
                    setUser(data);
                }
            }
        })();
        return () => {
            abort = true;
        };
    }, [query]);

    return (
        <>
            <div className="user-search-container">
                <h2>Search users</h2>
                <Input
                    className="input-field"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name"
                />
                {error && <p>Something went wrong.</p>}
            </div>
            <List className="user-list">
                {users.map((user) => (
                    <ListItem className="user-container" key={user.id}>
                        <Link to={`/users/${user.id}`}>
                            <div className="friend-profile-pic">
                                <ProfilePic props={user} />
                            </div>
                            <p>{`${user.first} ${user.last}`}</p>
                            <FriendButton otherId={user.id} />
                        </Link>
                    </ListItem>
                ))}
                {!users.length && query && <p>No Results</p>}
            </List>
        </>
    );
}
