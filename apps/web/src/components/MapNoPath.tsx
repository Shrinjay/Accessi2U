import React from "react";
import { TileLayer, GeoJSON, MapContainer, LayersControl } from "react-leaflet";
import L, { divIcon } from "leaflet";
import buildings from "./EngBuildings.json";
import floors from "./floors.json"
import rooms from "./rooms.json"


export default function GeojsonMap() {
    const [curFloor, setCurFloor] = React.useState("RCH_03");

    const customMarkerIcon = (name) =>
        divIcon({
            html: name,
            className: "icon"
        });

    const setColor = ({ properties }) => {

        const color_map = {
            "Office Service": 'yellow',
            "Study Area/Reading Room": 'green',
            "Student Office Facilities": 'yellow',
            "Laboratory - Wet": 'red',
            "Laboratory Support Space": 'red',
            "Laboratory - Dry": 'red',
            "Project Space": 'green',
            "Office": 'yellow',
            "Receiving Area": 'green',
            "Laboratory Storage - Flammables": 'red',
            "Storage": 'black',
            "Classroom": 'purple',
            "Mechanical Equipment Room": 'black',
            "Laboratory - Special Purpose Computer": 'red',
            "Computer Equipment/Hardware": 'red',
            "Toilets/Showers": 'blue'
        }

        return {
            weight: 1,
            fillColor: color_map[properties["rm_standard"]],
            color: 'black'
        };
    };

    const floorFilter = ({properties}) => {
        // https://gis.stackexchange.com/questions/189988/filtering-geojson-data-to-include-in-leaflet-map
        if (properties["FL_NM"] == curFloor) {
            return true;
        }
    };

    const setIcon = ({ properties }, latlng) => {
        return L.marker(latlng, { icon: customMarkerIcon(properties.description) });
    };

    return (
        <>
            <div style={{ position: 'relative', width: "100%", height: "100vh" }}>
                <MapContainer
                    center={[43.471689885, -80.54006515274773]}
                    zoom={19}
                    boxZoom={false}
                    maxBoundsViscosity={1.0}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" maxZoom={21} />
                    <LayersControl position={"topright"}>
                        <LayersControl.Overlay checked name={'Eng Buildings'}>
                            <GeoJSON data={buildings} style={setColor} filter={floorFilter}/>
                        </LayersControl.Overlay>
                        <LayersControl.Overlay checked name={'Eng Floors'}>
                            <GeoJSON data={floors} style={setColor} filter={floorFilter}/>
                        </LayersControl.Overlay>
                        <LayersControl.Overlay checked name={'Eng Rooms'}>
                            <GeoJSON data={rooms} style={setColor} filter={floorFilter}/>
                        </LayersControl.Overlay>
                    </LayersControl>

                    {/* <GeoJSON data={IMPORTED DATA HERE} pointToLayer={setIcon} /> */} {/*This is for labels, needs points not shapes*/}
                </MapContainer>
            </div>
        </>
    )


}