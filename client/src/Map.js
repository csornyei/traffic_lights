import GoogleMapReact from 'google-map-react';

function Map({ center, zoom }) {

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyB9ML8pQwo00zI0Z-z1JxY0tqZzrmZ1ns8" }}
                defaultCenter={center}
                defaultZoom={zoom}
            >
            </GoogleMapReact>
        </div>
    )
}

export default Map;