import GoogleMapReact from 'google-map-react';
import { useEffect, useState } from 'react';
import axios from "./axios";
import Marker from './Marker';

function Map({ center, zoom }) {

    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get("/");

            setMarkers(data);
        })();
    }, []);

    const mapMarkers = markers.map(marker => {
        return (
            <Marker
                key={marker.id}
                id={marker.id}
                status={marker.status.content}
                lat={marker.latitude}
                lng={marker.longitude}
            />
        )
    })

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyB9ML8pQwo00zI0Z-z1JxY0tqZzrmZ1ns8" }}
                defaultCenter={center}
                defaultZoom={zoom}
            >
                {mapMarkers}
            </GoogleMapReact>
        </div>
    )
}

export default Map;