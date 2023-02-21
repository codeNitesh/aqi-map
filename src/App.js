import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl';
import './App.css'
import "react-datepicker/dist/react-datepicker.css";
import Tooltip from './components/Tooltip';
import DateSelector from './components/DateSelector';


const layerStyle = {
  id: 'data',
  type: 'circle', // CHECK FOR IMAGE...
  paint: {
    'circle-radius': 10, // CHECK FOR IMAGE...
    'circle-color': [
      "step", ["get", "aqi"],
      "white", 0,
      "green", 40,
      "yellow", 70,
      "red"
    ]
  },
};


const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWlkYXNoLWl2bXMiLCJhIjoiY2s5MmFoaXZkMDJqaTN0b3R0MXp2ZW9vaCJ9.vHhKgvClj48SJpFwjSdgug'; // Set your mapbox token here


export default function App() {
  const [showPopup, setShowPopup] = React.useState(false);
  const [geojson, setGeojson] = React.useState(null);

  const [startDate, setStartDate] = useState(new Date("2023-02-17"));
  const [endDate, setEndDate] = useState(new Date("2023-02-17"));

  useEffect(() => {
    getLatestAQIData()
  }, [])

  const data = useMemo(() => {
    console.log(geojson)
    return geojson
  }, [geojson]);



  async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
  }

  const getLatestAQIData = async () => {
    setGeojson(null)
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);

    let day1 = date1.getDate();
    let month1 = date1.getMonth() + 1;
    let year1 = date1.getFullYear();

    let sDate = year1 + "-" + month1 + "-" + day1;

    let day2 = date2.getDate();
    let month2 = date2.getMonth() + 1;
    let year2 = date2.getFullYear();
    let eDate = year2 + "-" + month2 + "-" + day2;

    fetch("http://localhost:3003/aqi/range?date1=" + sDate + "&date2=" + eDate)
      .then(res => res.json())
      .then(
        async (result) => {
          if (result.message === "ok") {
            let index = 0;
            let loop = 0;
            const data = result.data;
            console.log(data.length)
            if (data.length === 1) {
              setGeojson(data[0])
              return;
            }

            while (loop < 10) {
              index++;
              loop++;
              setGeojson(data[index % data.length])
              await delay(5000)
            }
          } else {
            alert("Error... Showing old data.")
          }
        },
        (error) => {
          console.log(error)
        }
      )
  }

  const [popupInfo, setPopupInfo] = useState(null)


  const handlePointClick = useCallback(event => {
    const {
      features,
      point: { x, y },
      lngLat
    } = event;
    if (features.length === 0) {
      setShowPopup(false)
      return;
    }

    const pointData = {
      properties: {
        name: features[0].properties.name,
        aqi: features[0].properties.aqi,
        date: features[0].properties.date,
        pm25: features[0].properties.pm25,
        pm10: features[0].properties.pm10,
        o3: features[0].properties.o3,
      },
      geometry: { longitude: lngLat.lng, latitude: lngLat.lat },
      points: event.point
    }
    setPopupInfo(pointData);
    setShowPopup(true)
  }, []);


  useEffect(() => {
    getLatestAQIData();
  }, [startDate, endDate])

  const onStartDateChange = (date) => {
    setStartDate(date)
  }
  const onEndDateChange = (date) => {
    setEndDate(date)
  }

  return (
    <div style={{ height: '100vh' }}>
      <DateSelector startDate={startDate} endDate={endDate} onStartDateChange={onStartDateChange} onEndDateChange={onEndDateChange} />

      <Map initialViewState={{
        longitude: 78.069710,
        latitude: 22.679079,
        zoom: 4,
      }}
        style={{ position: 'relative' }}
        interactiveLayerIds={['data']}
        onClick={handlePointClick}
        mapStyle="mapbox://styles/aidash-ivms/ck92al8tf1z6d1ik4hup8wwp8"
        mapboxAccessToken={MAPBOX_TOKEN}>
        <Source id="data" type="geojson" data={data}>
          <Layer type="symbol" {...layerStyle} />
        </Source>

        <Tooltip showPopup={showPopup} popupInfo={popupInfo} />
      </Map>
    </div>
  );
}
