import React, { useCallback } from "react";
// import {Button} from "./components/ui/button"
// import { Field } from "./components/ui/field"
// import {useForm} from 'react-hook-form';
import Select from 'react-select';
import rooms from "../../../ingest/data/rooms_partial.json";
import { Button, VStack, StackSeparator, Switch} from "@chakra-ui/react";

export default function SelectLocations() {
    const [options, setOptions] = React.useState([]);
    const [startPoint, setStart] = React.useState(null);
    const [endPoint, setEnd] = React.useState(null);
    const [completedInfo, setCompleted] = React.useState(false);
    const [accessible, setAccessible] = React.useState(false);
    const [indoors, setIndoors] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    // https://stackoverflow.com/questions/73412077/how-to-use-json-data-for-react-select
    React.useEffect(() => {
        const getOptions = async () => {
            try {
                setIsLoading(true)
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
                setIsLoading(false)
            } catch (error){
                setOptions([{label: "ERROR", value:"ERROR"}])
            }
        }
        getOptions();
    }, []);

    React.useEffect(() => {
        if ((startPoint != null) && (endPoint != null)) {
            setCompleted(true)
        } else {
            setCompleted(false)
        }
    }, [startPoint, endPoint]);

    const pathSelected = () => {
        setIsLoading(true);
    } 

    return (
        <div>
            <VStack separator={<StackSeparator/>} gap ={6}>
            <Select isClearable 
                defaultValue={startPoint}
                options={options} 
                onChange={setStart} 
                required id="start-location"/>
            <Select
                defaultValue={endPoint}
                isClearable options={options}
                onChange={setEnd}
                required
                id="end-location"/>
            <Button 
                loading={isLoading} 
                loadingText="Loading"
                spinnerPlacement="start"
                size="lg" 
                variant="surface"
                disabled={!completedInfo}
                onClick = {pathSelected}
            >
                Submit
            </Button>
            </VStack>

        </div>
    );
}