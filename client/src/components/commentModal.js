import { Button } from "@material-ui/core";
import Comments from "./comments";

export default function CommentModal({ activePost, toggleModal }) {
    const handleClick = (e) => {
        if (e.target.className == "modal") {
            toggleModal();
        }
    };
    return (
        <div className="modal" onClick={handleClick}>
            <div className="modal-img-box">
                <div className="modal-header">
                    <h2>{activePost.title}</h2>
                    <Button onClick={toggleModal}>X</Button>
                </div>
                <img
                    className="marker-image"
                    src={activePost.url}
                    alt={`Image ${activePost.id}`}
                />
                <p className="standard-text">{activePost.description}</p>
                <span className="user-info marker-author">
                    {activePost.first} {activePost.last} on {activePost.time}
                </span>
                <Comments markerId={activePost.id} />
            </div>
        </div>
    );
}
