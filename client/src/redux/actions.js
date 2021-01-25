import axios from "../axios";

export async function getActiveUser() {
    const { data } = await axios.get("/user/profile");
    return {
        type: "GET_ACTIVE_USER",
        activeUser: { ...data },
    };
}

export function updateBio(bio) {
    return {
        type: "UPDATE_BIO",
        newBio: bio,
    };
}

export function updateProfilePic(img) {
    return {
        type: "UPDATE_PROFILE_PIC",
        newImg: img,
    };
}

export async function getOtherUser(id) {
    const { data } = await axios.get(`/user/profile/${id}`);
    return {
        type: "GET_OTHER_USER",
        otherUser: { ...data },
    };
}

export async function getFriendList() {
    const { data } = await axios.get("/friendships");
    return {
        type: "GET_FRIEND_LIST",
        users: data.users,
        idSelf: data.idSelf,
    };
}

export async function acceptRequest(otherId) {
    const { data } = await axios.post(`/friendship-action/Accept/${otherId}`);
    if (data.success) {
        return {
            type: "ACCEPT_REQUEST",
            id: otherId,
        };
    }
}

export async function unfriend(otherId) {
    const { data } = await axios.post(`/friendship-action/Cancel/${otherId}`);
    if (data.success) {
        return {
            type: "UNFRIEND",
            id: otherId,
        };
    }
}

export async function getMapMarker() {
    const { data } = await axios.get("/map/marker");
    return {
        type: "GET_MAP_MARKER",
        mapMarker: [ ...data ],
    };
}

export async function addMapMarker(params) {
    const { data } = await axios.post("/map/marker", params);
    return {
        type: "ADD_MAP_MARKER",
        newMapMarker: data ,
    };
}
