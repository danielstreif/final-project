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

    return state;
}
