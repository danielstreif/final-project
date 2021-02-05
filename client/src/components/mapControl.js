import MarkerPreview from "../components/markerPreview";
import { FormControlLabel, Checkbox } from "@material-ui/core";

export default function MapControl({
    setCategoryFilter,
    focusViewport,
    toggleModal,
    filter,
    filteredMarker,
}) {
    const showPreview = () => {
        let content = [];
        for (let i = 1; i <= 3; i++) {
            content.push(
                <li key={i}>
                    <MarkerPreview
                        marker={filteredMarker[filteredMarker.length - i]}
                        focus={focusViewport}
                        toggleModal={toggleModal}
                    />
                </li>
            );
        }
        return content;
    };

    return (
        <>
            <h2>Recently added crags</h2>
            <div className="select-category">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={filter.boulder}
                            onChange={setCategoryFilter}
                            name="boulder"
                            color="primary"
                        />
                    }
                    label="Bouldering"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={filter.sport}
                            onChange={setCategoryFilter}
                            name="sport"
                            color="primary"
                        />
                    }
                    label="Sport Climbing"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={filter.trad}
                            onChange={setCategoryFilter}
                            name="trad"
                            color="primary"
                        />
                    }
                    label="Trad Climbing"
                />
            </div>
            {filteredMarker && filteredMarker.length > 0 && (
                <ul>{showPreview()}</ul>
            )}
        </>
    );
}
