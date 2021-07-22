import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { StateContext } from "./state";
import axios from "./axios";

const TrafficLight = styled.div`
    display: inline-block;
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
`;

const LightsContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2px 4px;
    background-color: #888;
    border-radius: 6px;
    max-height: 32px;
`;

const Light = styled.div`
    background-color: ${props => props.on ? props.color : "#000"};
    height: 6px;
    width: 6px;
    border-radius: 50%;
    margin: 2px 0;
`;

const DataPopup = styled.div`
    background-color: white;
    z-index: 100;
    padding: 6px 12px;
    border: 1px solid black;
    border-radius: 6px;
    margin-left: 6px;
    width: 150px;
`;

const StatusText = styled.span`
    display: block;
`;

function getFormatedDate(date) {
    date = new Date(date);
    const padNumberWithZero = n => n < 10 ? `0${n}` : `${n}`;
    const year = date.getFullYear();
    const month = padNumberWithZero(date.getMonth() + 1);
    const day = padNumberWithZero(date.getDate());
    const hour = padNumberWithZero(date.getHours());
    const minutes = padNumberWithZero(date.getMinutes());
    const seconds = padNumberWithZero(date.getSeconds());
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

function Marker({ id, status, $hover }) {

    const [lightStatus, setLightStatus] = useState({
        red: 0,
        yellow: 0,
        green: 0,
        errors: 0
    });
    const [currentStatus, setCurrentStatus] = useState(status);
    const { state: { socket } } = useContext(StateContext);

    const now = Date.now();
    const twoWeeksAgo = Date.now() - (2 * 7 * 24 * 60 * 60 * 1000);

    useEffect(() => {
        if ($hover) {
            (async () => {
                const { data } = await axios.get(`/${id}?start=${getFormatedDate(twoWeeksAgo)}&end=${getFormatedDate(now)}`);
                const statuses = {
                    red: 0,
                    yellow: 0,
                    green: 0,
                    errors: 0
                };

                data.forEach(d => {
                    if (d.type === "status") {
                        switch (d.content) {
                            case "red":
                                statuses.red += 1;
                                break;
                            case "yellow":
                                statuses.yellow += 1;
                                break;
                            case "green":
                                statuses.green += 1;
                                break;
                            default:
                                break;
                        }
                    } else {
                        statuses.errors += 1;
                    }
                });

                setLightStatus(statuses);
            })()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [$hover, id]);

    const requestCurrentStatus = (id) => {
        socket.emit("clientSensorStatus", id);
    }

    socket.on("sensorStatusUpdate", (res) => {
        if (res.id === id) {
            setCurrentStatus(res.status);
        }
    })

    return (
        <TrafficLight onClick={() => requestCurrentStatus(id)}>
            <Container>
                <LightsContainer>
                    <Light color="#ff0000" on={currentStatus === "red"} />
                    <Light color="#ffff00" on={currentStatus === "yellow"} />
                    <Light color="#00ff00" on={currentStatus === "green"} />
                </LightsContainer>
                {$hover ? <DataPopup>
                    <StatusText>Data for sensor #{id} between</StatusText>
                    <StatusText>{getFormatedDate(twoWeeksAgo)} and</StatusText>
                    <StatusText style={{ "marginBottom": "6px" }}>{getFormatedDate(now)}</StatusText>
                    <StatusText>Red: {lightStatus.red}</StatusText>
                    <StatusText>Yellow: {lightStatus.yellow}</StatusText>
                    <StatusText>Green: {lightStatus.green}</StatusText>
                    <StatusText>Errors: {lightStatus.errors}</StatusText>
                </DataPopup> : null
                }
            </Container>
        </TrafficLight>
    )
}

export default Marker;