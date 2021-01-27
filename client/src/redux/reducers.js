export default function reducer(state = {}, action) {
    if (action.type == "GET_ACTIVE_USER") {
        state = {
            ...state,
            activeUser: action.activeUser,
        };
    }

    if (action.type == "UPDATE_BIO") {
        state = {
            ...state,
            activeUser: {
                ...state.activeUser,
                bio: action.newBio,
            },
        };
    }

    if (action.type == "UPDATE_PROFILE_PIC") {
        state = {
            ...state,
            activeUser: {
                ...state.activeUser,
                url: action.newImg,
            },
        };
    }

    if (action.type == "GET_OTHER_USER") {
        state = {
            ...state,
            otherUser: action.otherUser,
        };
    }

    if (action.type == "GET_FRIEND_LIST") {
        state = {
            ...state,
            users: action.users,
            idSelf: action.idSelf,
        };
    }

    if (action.type == "ACCEPT_REQUEST") {
        state = {
            ...state,
            users: state.users.map((user) => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        accepted: true,
                    };
                } else {
                    return user;
                }
            }),
        };
    }

    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            users: state.users.filter((user) => user.id != action.id),
        };
    }

    if (action.type == "GET_ONLINE_USERS") {
        state = {
            ...state,
            onlineUsers: action.onlineUsers,
        };
    }

    if (action.type == "NEW_FRIEND_REQUEST") {
        state = {
            ...state,
            openRequests: true,
        };
    }

    if (action.type == "RESET_FRIEND_REQUESTS") {
        state = {
            ...state,
            openRequests: false,
        };
    }

    if (action.type == "GET_PRIVATE_MESSAGES") {
        state = {
            ...state,
            privateMessages: action.privateMessages,
            privateCorrspondant: action.privateCorrespondent,
        };
    }

    if (action.type == "RECEIVE_PRIVATE_MESSAGE") {
        if (state.privateCorrespondent == action.senderId) {
            return (state = {
                ...state,
                privateMessages: [
                    ...state.privateMessages,
                    action.newPrivateMessage,
                ],
            });
        } else {
            return (state = {
                ...state,
                messageNotification: action.senderId,
            });
        }
    }

    if (action.type == "MESSAGE_SENT") {
        state = {
            ...state,
            privateMessages: [
                ...state.privateMessages,
                action.sentPrivateMessage,
            ],
        };
    }

    if (action.type == "MESSAGE_DELETED") {
        state = {
            ...state,
            privateMessages: state.privateMessages.map((messageData) => {
                if (messageData.id == action.deletedMessage) {
                    return {
                        ...messageData,
                        message: "message deleted",
                    };
                } else {
                    return messageData;
                }
            }),
        };
    }

    if (action.type == "GET_MAP_MARKER") {
        state = {
            ...state,
            mapMarker: action.mapMarker,
        };
    }

    if (action.type == "GET_PERSONAL_MARKER") {
        state = {
            ...state,
            personalMarker: action.personalMarker,
        };
    }

    if (action.type == "ADD_MAP_MARKER") {
        state = {
            ...state,
            mapMarker: [...state.mapMarker, action.newMapMarker],
        };
    }

    if (action.type == "REMOVE_MAP_MARKER") {
        state = {
            ...state,
            mapMarker: state.mapMarker.filter(
                (marker) => marker.id != action.id
            ),
        };
    }

    return state;
}
