import React from "react";
import { TileLayer, GeoJSON, MapContainer, LayersControl, useMap } from "react-leaflet";
import L, { divIcon} from "leaflet";
import buildings from "./EngBuildings.json";
import rooms from "./rooms.json"
import rooms_centroids from "./rooms_centroids.json"
// import floor_centroids from "./floor_centroids.csv"
import { useSwipeable} from "react-swipeable";


const floorList = ["RCH_01", "RCH_02", "RCH_03", "CPH_01", "E2_01", "E2_02"]
const roomList = ["RCH 101", "RCH 122", "RCH 123", "RCH 119", "RCH 103", "RCH 105", "RCH 212", "RCH 301"]
const floorCentroidMap = {DWE_01:[-80.5395194675902,43.47007771086484],
    DWE_02:[-80.53952030998597,43.47007907367728],
    DWE_03:[-80.5396902053169,43.469992313962365],
    E2_01:[-80.54026339792681,43.47095174436507],
    E2_02:[-80.54029876765055,43.4708671073802],
    E2_03:[-80.54026153339854,43.47078970337546],
    E2_04:[-80.54026562642431,43.47090151724052],
    E3_01:[-80.54077446538352,43.47196822574825],
    E3_02:[-80.54076133981175,43.47157752205636],
    E3_02M:[-80.54063539250274,43.47157435469927],
    E3_03:[-80.54080600175348,43.47177534087369],
    E3_04:[-80.54088636230847,43.47210455206676],
    RCH_01:[-80.54072575754529,43.47028851150243],
    RCH_02:[-80.54074830457235,43.47027988772001],
    RCH_03:[-80.54070990351131,43.47028662860849],
    RCH_04:[-80.54062889558605,43.470316519377214],
    CPH_01:[-80.53934360285233,43.470981100790695],
    CPH_02:[-80.53935044953892,43.47102846701261],
    CPH_03:[-80.53938649136748,43.47099393494527],
    CPH_04:[-80.53915798212466,43.47081176584892],
    E5_01:[-80.5400302753483,43.47289679169119],
    E5_02:[-80.53997117181834,43.47285219949009],
    E5_03:[-80.54002546114906,43.47277477639429],
    E5_04:[-80.54000775639598,43.472860154288966],
    E5_05:[-80.54000775075016,43.472860153654175],
    E5_06:[-80.54000939953679,43.47285738994101],
    E6_01:[-80.53867463654119,43.47302425017082],
    E6_02:[-80.53866443434609,43.473014931764766],
    E6_03:[-80.53867265247261,43.47302168187215],
    E6_04:[-80.53867265247261,43.47302168187215],
    E6_05:[-80.53867265249575,43.47302168165029],
    E6_06:[-80.53867840937606,43.473029774807536],
    E7_01:[-80.53956609022158,43.47295164042191],
    E7_02:[-80.53955031400253,43.47294296388055],
    E7_03:[-80.53950770799514,43.47296383485508],
    E7_04:[-80.53952250119977,43.47295759431693],
    E7_05:[-80.53952427199614,43.472957130526375],
    E7_06:[-80.539521158232,43.47295886846611],
    E7_07:[-80.53950832265619,43.47296141278375]}

export default function PathMap() {
    const [floorIndex, setFloorIndex] = React.useState(0);
    const [curFloor, setCurFloor] = React.useState(floorList[0]);
    const [center, setCenter] = React.useState([43.47028851150243,-80.54072575754529])

    React.useEffect(() => {
        setCurFloor(floorList[floorIndex])
        setCenter([floorCentroidMap[floorList[floorIndex]][1], floorCentroidMap[floorList[floorIndex]][0]])
    }, [floorIndex])

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => setFloorIndex(Math.min(floorIndex + 1, floorList.length - 1)),
        onSwipedRight: () => setFloorIndex(Math.max(floorIndex - 1, 0)),
        swipeDuration: 200,
        preventScrollOnSwipe: false,
        trackMouse: true
    })

    return (
        <>
            <div style={{ position: 'relative', width: "100%", height: "100vh" }} {...swipeHandlers}>
                {floorIndex + 1}: {curFloor}
                <FloorMap curFloor={curFloor} roomList={roomList} center={center} />
            </div>
        </>
    )
}

function ChangeView({center}) {
    const map = useMap();
    map.panTo(center);
    return null;
}

function FloorMap({ curFloor, roomList, center }) {

    const setColor = ({ properties }) => {
        if (roomList.includes(properties["RM_NM"])){
            return {
                weight: 1,
                fillColor: "yellow",
                color: 'white'
            };
        } else {
            return {
                weight: 1,
                fillColor: "black",
                color: 'white'
            };
        }


    };

    const customMarkerIcon = (text) =>
        divIcon({
          html: text,
          className: "icon"
    });

    const setIcon = ({ properties }, latlng) => {
        return L.marker(latlng, { icon: customMarkerIcon(properties.rm_id) });
      };

    const floorFilter = ({ properties }) => {
        // https://gis.stackexchange.com/questions/189988/filtering-geojson-data-to-include-in-leaflet-map
        if (properties["FL_NM"] === curFloor) {
            return true;
        } else {
            return false;
        }
    };

    const classNumFilter = ({ properties }) => {
        // https://gis.stackexchange.com/questions/189988/filtering-geojson-data-to-include-in-leaflet-map
        if ((properties["FL_NM"] === curFloor) && (properties["rm_standard"] === "Classroom")) {
            return true;
        } else {
            return false;
        }
    };

    const otherNumFilter = ({ properties }) => {
        // https://gis.stackexchange.com/questions/189988/filtering-geojson-data-to-include-in-leaflet-map
        if ((properties["FL_NM"] === curFloor) && (properties["rm_standard"] !== "Classroom")) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <div className="map">
            <MapContainer
                center={center}
                zoom={19.5}
                boxZoom={false}
                maxBoundsViscosity={1.0}
                maxZoom={21}
                minZoom={18}
            >
                <ChangeView center={center}/>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" maxZoom={21} />
                <LayersControl position={"topright"}>
                    <LayersControl.Overlay checked name={'Eng Buildings'}>
                        <GeoJSON data={buildings} style={setColor}/>
                    </LayersControl.Overlay>
                    {/* <LayersControl.Overlay checked name={'Eng Floors'}>
                        <GeoJSON data={floors} style={setColor} filter={floorFilter} key={curFloor} />
                    </LayersControl.Overlay> */}
                    <LayersControl.Overlay checked name={'Eng Rooms'}>
                        <GeoJSON data={rooms} style={setColor} filter={floorFilter} key={curFloor} />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name={'Classroom Numbers'}>
                        <GeoJSON data={rooms_centroids} pointToLayer={setIcon} filter={classNumFilter} key={curFloor}/>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked={false} name={'Other Room Numbers'}>
                        <GeoJSON data={rooms_centroids} pointToLayer={setIcon} filter={otherNumFilter} key={curFloor}/>
                    </LayersControl.Overlay>

                </LayersControl>

            </MapContainer>
        </div>
    )
}