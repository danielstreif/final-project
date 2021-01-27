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

export function getOnlineUsers(userArr) {
    return {
        type: "GET_ONLINE_USERS",
        onlineUsers: userArr,
    };
}

export function newFriendRequest(userInfo) {
    return {
        type: "NEW_FRIEND_REQUEST",
        newOpenRequest: userInfo,
    };
}

export function resetFriendRequests() {
    return {
        type: "RESET_FRIEND_REQUESTS",
    };
}

export async function getPrivateMessages(id) {
    const { data } = await axios.get(`/user/messages/${id}`);
    return {
        type: "GET_PRIVATE_MESSAGES",
        privateMessages: data.success,
        privateCorrespondent: data.otherId,
    };
}

export function receiveNewPrivateMessage(msg, userId) {
    return {
        type: "RECEIVE_PRIVATE_MESSAGE",
        newPrivateMessage: msg,
        senderId: userId,
    };
}

export function messageSent(message) {
    return {
        type: "MESSAGE_SENT",
        sentPrivateMessage: message,
    };
}

export function messageDeleted(messageId) {
    return {
        type: "MESSAGE_DELETED",
        deletedMessage: messageId,
    };
}

export async function getMapMarker() {
    const { data } = await axios.get("/map/marker");
    return {
        type: "GET_MAP_MARKER",
        mapMarker: [...data],
    };
}

export async function getMarkerByUser(id) {
    const { data } = await axios.get(`/map/marker/${id}`);
    return {
        type: "GET_PERSONAL_MARKER",
        personalMarker: [...data],
    };
}

export async function addMapMarker(formData) {
    const { data } = await axios.post("/map/marker", formData);
    return {
        type: "ADD_MAP_MARKER",
        newMapMarker: data,
    };
}

export async function removeMapMarker(id) {
    const { data } = await axios.get(`/map/marker/remove/${id}`);
    return {
        type: "REMOVE_MAP_MARKER",
        id: data.id,
    };
}
