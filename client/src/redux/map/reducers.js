export default function reducer(state = {}, action) {
    if (action.type == "GET_MAP_MARKER") {
        state = {
            ...state,
            mapMarker: action.mapMarker,
        };
    }

    if (action.type == "ADD_MAP_MARKER") {
        state = {
            ...state,
            mapMarker: [...state.mapMarker, action.newMapMarker],
        };
    }

    return state;
}
