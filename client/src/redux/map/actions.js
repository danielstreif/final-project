import axios from "../../axios";

export async function getMapMarker() {
    const { data } = await axios.get("/map/marker");
    return {
        type: "GET_MAP_MARKER",
        mapMarker: { ...data },
    };
}

export async function addMapMarker() {
    const { data } = await axios.post("/map/marker");
    return {
        type: "ADD_MAP_MARKER",
        newMapMarker: { ...data },
    };
}