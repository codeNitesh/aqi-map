import React from 'react';

export default function Tooltip({ showPopup, popupInfo }) {

    const tooltipStyle = {
        position: 'absolute',
        margin: '8px',
        padding: '10px',
        background: '#e4f3ff',
        color: 'black',
        maxWidth: '300px',
        fontSize: '15px',
        zIndex: 100,
        pointerEvents: 'none',
        borderRadius: '10px',
        border: '1px solid gray',
    }

    return (
        <>
            {showPopup && (
                <div className="tooltip" style={{ ...tooltipStyle, left: popupInfo.points.x, top: popupInfo.points.y }}>
                    <p><span>Station Name:</span> {popupInfo.properties.name}</p>
                    <p><span>AQI:</span> {popupInfo.properties.aqi}</p>
                    <p><span>Date:</span> {popupInfo.properties.date}</p>
                    <p><span>pm25:</span> {popupInfo.properties.pm25}</p>
                    <p><span>pm10:</span> {popupInfo.properties.pm10}</p>
                    <p><span>o3:</span> {popupInfo.properties.o3}</p>
                </div>
            )}
        </>
    )
}