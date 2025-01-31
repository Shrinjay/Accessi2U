import React, { useCallback } from "react";
// import {Button} from "./components/ui/button"
// import { Field } from "./components/ui/field"
// import {useForm} from 'react-hook-form';
import Select from 'react-select';
import rooms from "../../../ingest/data/rooms_partial.json";

export default function SelectLocations() {
    const [options, setOptions] = React.useState([]);
    const [startPoint, setStart] = React.useState("");
    const [endPoint, setEnd] = React.useState("");

    // https://stackoverflow.com/questions/73412077/how-to-use-json-data-for-react-select
    React.useEffect(() => {
        const getOptions = async () => {
            try {
                setOptions(
                    rooms["features"].map(({properties}) => ({
                        floor_Name: properties.FL_NM,
                        building: properties.alt_bl_id,
                        department: properties.Departments_name,
                        room_type: properties.USE_TYPE,
                        room_number: properties.NAME,
                        label: properties.RM_NM,
                        value: properties.RM_NM,
                    }))
                );
            } catch (error){
                setOptions([{label: "ERROR", value:"ERROR"}])
            }
        }

        getOptions();
    }, []);

    return (
        <div>
            <Select isClearable 
                options={options} 
                onChange={setStart} 
                required id="start-location"/>

            <Select
                isClearable options={options}
                onChange={setEnd}
                required
                id="end-location"/>

        </div>
    );
}