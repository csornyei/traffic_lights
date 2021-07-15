import GoogleMapReact from 'google-map-react';
import { useEffect, useState } from 'react';
import axios from "./axios";
import Marker from './Marker';

function Map({ center, zoom }) {

    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get("/");
            console.log(data);
            setMarkers(data);
        })();
    }, []);

    const mapMarkers = markers.map(marker => {
        return (
            <Marker
                key={marker.sensor_id}
                id={marker.sensor_id}
                status={marker.content}
                lat={marker.latitude}
                lng={marker.longitude}
            />
        )
    })

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API }}
                defaultCenter={center}
                defaultZoom={zoom}
                hoverDistance={30}
            >
                {mapMarkers}
            </GoogleMapReact>
        </div>
    )
}

export default Map;