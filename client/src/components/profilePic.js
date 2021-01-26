export default function ProfilePic({ props }) {
    let imageUrl = props.url;

    if (imageUrl == null || imageUrl == undefined) {
        imageUrl = "/img/placeholder.png";
    }

    return (
        <img
            className="profile-pic"
            src={imageUrl}
            alt={`${props.first} ${props.last}`}
        />
    );
}
