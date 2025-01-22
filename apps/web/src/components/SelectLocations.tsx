import React, { useCallback } from "react";
import {Button} from "./components/ui/button"
import { Field } from "./components/ui/field"
import {useForm} from 'react-hook-form';
import Select from 'react-select';

export default function SelectLocations() {
    const options = [
        {value:"E7 1234", label:"E7 1234 (Ideas Clinic)"},
        {value:"E7 2234", label:"E7 2234 (Ideas Clinic 2nd Floor)"},
        {value:"E7 1236", label:"E7 1236"},
        {value:"E7 1238", label:"E7 1238"},
        {value:"E5 1234", label:"E5 1234"},
        {value:"CPH 1856", label:"CPH 1856 (POETS)"},
        {value:"E5 5432", label:"E5 5432"},
        {value:"E7 3551", label:"E7 3551 (Event Space)"},
        {value:"CPH 1850", label:"CPH 1850 (EngSoc Office)"},
        {value:"CPH 1844", label:"CPH 1844"},
        {value:"CPH 1843", label:"CPH 1843"},
        {value:"E7 1123", label:"E7 1123"}
    ]



    return (
        <div>
            <Field>
                <Select isClearable options={options}/>
            </Field>

            <Field>
                <Select isClearable options={options}/>
            </Field>
            <Button>Let's Go!</Button>
        </div>
    );
}