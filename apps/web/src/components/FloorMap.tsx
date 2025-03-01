import { useEffect, useState } from "react";
import { TileLayer, GeoJSON, MapContainer, LayersControl, useMap, LayerGroup, Popup, FeatureGroup} from "react-leaflet";
import L, { divIcon} from "leaflet";
import buildings from "../../../ingest/data/Eng_Buildings.json";
import rooms from "../../../ingest/data/rooms_partial.json";
import rooms_centroids from "../../../ingest/data/rooms_centroids_partial.json";
// import floor_centroids from "../../../ingest/data/floors_centroids_partial.json"
import 'leaflet/dist/leaflet.css';
import ReportMenu from './ReportMenu';
import { Button, Heading, useDisclosure, Text, Box, Modal} from "@chakra-ui/react";

function ChangeView({center}) {
    const map = useMap();
    map.panTo(center);

    useEffect(() => {
        setTimeout(() => { 
            map.invalidateSize(); 
        }, 250); 
    }, [map])
    return null;
}

export default function FloorMap({ curFloor, roomList, center, checkedIndex}) {
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [selectedRoomName, setSelectedRoomName] = useState(null)
    const accessibilityMap = {"Y": "True", "N": "False"}
    const {isOpen, onOpen, onClose} = useDisclosure()

    useEffect(() => {
        if (selectedRoom != null){
            setSelectedRoomName({value: selectedRoom.properties.RM_NM, label: selectedRoom.properties.RM_NM})
        }
    }, [selectedRoom]);

    const setColor = ({ properties }) => {
        if (!(roomList.includes(properties["RM_NM"]))){
            // rooms not in the route
            return {
                weight: 1,
                fillColor: "black",
                color: 'white'
            };
        } else if ((roomList[0] == properties["RM_NM"]) || (roomList[roomList.length - 1]==properties["RM_NM"])){
            // first and last rooms
            return {
                weight: 1,
                fillColor: "#d500ff",
                color: 'white'
            };
        }

        if (checkedIndex < 0) {
            if ((properties["USE_TYPE"] == "Stairs") || (properties["USE_TYPE"] == "Elevators")) {
                return {
                    // rooms on route
                    weight: 1,
                    fillColor: "#ffff00",
                    color: 'white'
                };
            } else {
                return {
                    // rooms on route
                    weight: 1,
                    fillColor: "#ffff00",
                    color: 'white'
                };
            }
        } else {
            // at least 1 step marked as completed
            if (roomList.indexOf(properties["RM_NM"]) < checkedIndex) {
                // room has been visited
                return {
                    weight: 1,
                    fillColor: "#0044d5",
                    color: 'white'
                };
            } else if (roomList.indexOf(properties["RM_NM"]) == checkedIndex) {
                // currently in room
                return {
                    weight: 1,
                    fillColor: "#00b32c",
                    color: 'white'
                };
            } else if ((properties["USE_TYPE"] == "Stairs") || (properties["USE_TYPE"] == "Elevators")) {
                // staircase or elevator on route
                return {
                    weight: 1,
                    fillColor: "#ffff00",
                    color: 'white'
                };
            } else {
                // room is unvisited
                return {
                    weight: 1,
                    fillColor: "#ffff00",
                    color: 'white'
                };
            }
        }
      
    };

    const customMarkerIcon = (text) =>
        divIcon({
          className: "icon",
          html: text,
          iconSize: [30,30],
          iconAnchor: [10,5]
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
            <Button onClick={onOpen}
                size="lg" colorScheme="purple"
                bg="purple.500"
                fontSize="20px"
                _hover={{ bg: "#67487d" }}
                _active={{ bg: "#67487d" }}
                fontWeight="bold"
                borderRadius="6px"
                px="12px"
                style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 75,
                marginInline: 'auto',
                zIndex: 1000
                }}>

                Report Issue
            </Button>
            <MapContainer
                inertia={false}
                center={center}
                zoom={19}
                boxZoom={false}
                maxBoundsViscosity={1.0}
                maxZoom={21}
                minZoom={18}
            >
                <ChangeView center={center}/>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png" 
                    maxZoom={21} tms={true}/>
                <LayerGroup>
                    <GeoJSON data={buildings} style={setColor}/>
                    {rooms.features.map((feature, index)=> {
                        return (
                            <FeatureGroup key={index}>
                                <Popup>
                                    <Box
                                        bg="white"
                                        boxShadow="sm"
                                        display="flex"
                                        flexDirection="column"
                                        my="-1"
                                    >
                                        <Heading size="md" fontSize="lg" textAlign="center" mt="0px">
                                            {feature.properties.RM_NM}
                                        </Heading>

                                        <Text fontSize="sm" fontWeight="normal">
                                            Room Type: {feature.properties.rm_standard}</Text>
                                        <Text fontSize='sm' fontWeight="normal">
                                            Department: {feature.properties.Departments_name}</Text>
                                        <Text fontSize='sm' fontWeight="normal">
                                            Accessible: {accessibilityMap[feature.properties.brg_accessible]}</Text>

                                        <Button
                                            size="sm"
                                            colorScheme="yellow"
                                            bg="yellow.500"
                                            fontSize="14px"
                                            _hover={{ bg: "#D99A00" }}
                                            _active={{ bg: "#C78C00" }}
                                            fontWeight="bold"
                                            borderRadius="6px"
                                            px="6px"
                                            alignSelf="center"
                                            onClick={onOpen}
                                            onMouseOver={() => setSelectedRoom(feature)}
                                        >
                                            Report Issue
                                        </Button>
                                    </Box>
                                </Popup>
                                <GeoJSON data={feature} style={setColor} filter={floorFilter} key={curFloor}/>
                            </FeatureGroup>
                        )
                    })}

                    <GeoJSON data={rooms_centroids} pointToLayer={setIcon} filter={classNumFilter} key={curFloor}/>

                    <LayersControl position={"topright"}>
                        <LayersControl.Overlay checked={false} name={'Other Room Numbers'}>
                            <GeoJSON data={rooms_centroids} pointToLayer={setIcon} filter={otherNumFilter} key={curFloor}/>
                        </LayersControl.Overlay>
                    </LayersControl>
                </LayerGroup>

            </MapContainer>
            <Modal blockScrollOnMount={true}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ReportMenu onClose={onClose} passedRoom={selectedRoom} defaultRoom={selectedRoomName}/>
            </Modal>
        </div>
    )
}