import styled from "styled-components";

const TrafficLight = styled.div`
    display: inline-block;
    position: relative;
`;

const IdText = styled.span`
    position: absolute;
    left: -5px;
    top: -10px;
`;

const LightsContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2px 4px;
    background-color: #888;
    border-radius: 6px;
`;

const Light = styled.div`
    background-color: ${props => props.on ? props.color : "#000"};
    height: 6px;
    width: 6px;
    border-radius: 50%;
    margin: 2px 0;
`;

function Marker({ id, status }) {
    return (
        <TrafficLight>
            <IdText>{id}</IdText>
            <LightsContainer>
                <Light color="#ff0000" on={status === "red"} />
                <Light color="#ffff00" on={status === "yellow"} />
                <Light color="#00ff00" on={status === "green"} />
            </LightsContainer>
        </TrafficLight>
    )
}

export default Marker;