import React from 'react';
import DatePicker from "react-datepicker";

export default function DateSelector({ startDate, endDate, onStartDateChange, onEndDateChange }) {

    const dataPickerStyle = {
        width: '200px',
        position: 'absolute',
        zIndex: 1000,
        right: 20,
        top: 20,
        padding: '20px',
        paddingRight: '30px',
        paddingTop: '10px',
        borderRadius: '10px',
        backgroundColor: "white"
    }

    return (
        <>
            <div style={dataPickerStyle}>
                <h3>Select Date</h3>
                Start Date: <DatePicker selected={startDate} onChange={onStartDateChange} />
                End Date: <DatePicker selected={endDate} onChange={onEndDateChange} />
            </div>
        </>
    )
}