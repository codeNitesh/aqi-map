// import * as React from 'react';
// import {useState, useEffect, useMemo, useCallback} from 'react';
// import {render} from 'react-dom';
// import Map, {Source, Layer} from 'react-map-gl';
// // import ControlPanel from './control-panel';

// import {dataLayer} from './components/map-style';
// import {updatePercentiles} from './components/utils';

// const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWlkYXNoLWl2bXMiLCJhIjoiY2s5MmFoaXZkMDJqaTN0b3R0MXp2ZW9vaCJ9.vHhKgvClj48SJpFwjSdgug'; // Set your mapbox token here

// export default function App() {
//   const [year, setYear] = useState(2015);
//   const [allData, setAllData] = useState(null);
//   const [hoverInfo, setHoverInfo] = useState(null);

//   useEffect(() => {
//     /* global fetch */
//     fetch(
//       'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson'
//     )
//       .then(resp => resp.json())
//       .then(json => setAllData(json))
//       .catch(err => console.error('Could not load data', err)); // eslint-disable-line
//   }, []);

//   const onHover = useCallback(event => {
//     const {
//       features,
//       point: {x, y}
//     } = event;
//     const hoveredFeature = features && features[0];

//     // prettier-ignore
//     setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
//   }, []);

//   const data = useMemo(() => {
//     return allData && updatePercentiles(allData, f => f.properties.income[year]);
//   }, [allData, year]);

//   return (
//     <div style={{height: '80vh'}}>
//       <Map
//         initialViewState={{
//           latitude: 40,
//           longitude: -100,
//           zoom: 3
//         }}
//         mapStyle="mapbox://styles/mapbox/light-v9"
//         mapboxAccessToken={MAPBOX_TOKEN}
//         interactiveLayerIds={['data']}
//         onMouseMove={onHover}
//       >
//         <Source type="geojson" data={data}>
//           <Layer {...dataLayer} />
//         </Source>
//         {hoverInfo && (
//           <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
//             <div>State: {hoverInfo.feature.properties.name}</div>
//             <div>Median Household Income: {hoverInfo.feature.properties.value}</div>
//             <div>Percentile: {(hoverInfo.feature.properties.percentile / 8) * 100}</div>
//           </div>
//         )}
//       </Map>

//       {/* <ControlPanel year={year} onChange={value => setYear(value)} /> */}
//     </div>
//   );
// }

import React, {useState, useEffect, useMemo, useCallback} from 'react';
import Map, {Source, Layer, Popup} from 'react-map-gl';

const geojson = {
  type: 'FeatureCollection',
  features: [
    {type: 'Feature', geometry: {type: 'Point', coordinates: [-122.4, 37.8]}, properties: {name: "Nitesh 1"}},
    {type: 'Feature', geometry: {type: 'Point', coordinates: [-125.4, 22.8]}, properties: {name: "Nitesh 2"}},
    {type: 'Feature', geometry: {type: 'Point', coordinates: [-132.4, 54.8]}, properties: {name: "Nitesh 3"}},
    {type: 'Feature', geometry: {type: 'Point', coordinates: [-142.4, 87.8]}, properties: {name: "Nitesh 4"}},
    {type: 'Feature', geometry: {type: 'Point', coordinates: [-182.4, 17.8]}, properties: {name: "Nitesh 5"}},
  ]
};

const layerStyle = {
  id: 'data',
  type: 'circle', // CHECK FOR IMAGE...
  paint: {
    'circle-radius': 10, // CHECK FOR IMAGE...
    'circle-color': '#007cbf' // CHECK FOR IMAGE...
  },
 
};


const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWlkYXNoLWl2bXMiLCJhIjoiY2s5MmFoaXZkMDJqaTN0b3R0MXp2ZW9vaCJ9.vHhKgvClj48SJpFwjSdgug'; // Set your mapbox token here


export default function App() {
  const [viewport, setViewport] = React.useState();
  const [showPopup, setShowPopup] = React.useState(false);

  const tooltipStyle = {
    position: 'absolute',
    margin: '8px',
    padding: '4px',
    background: 'white',
    color: 'black',
    maxWidth: '300px',
    fontSize: '15px',
    zIndex: 100,
    pointerEvents: 'none'
  }

  const data = useMemo(() => {
    return geojson
  }, [geojson]);

  const [popupInfo, setPopupInfo] = useState(null)

  const handlePointClick = useCallback(event => {
    const {
      features,
      point: {x, y},
      lngLat
    } = event;
    if(features.length === 0){
      setShowPopup(false)
      return;
    } 

    const pointData = {
      properties: {name: features[0].properties.name},
      geometry: {longitude: lngLat.lng, latitude: lngLat.lat},
      points: event.point
    }
    setPopupInfo(pointData);
    setShowPopup(true)
  }, []);

  useEffect(()=>{
    console.log(popupInfo)
  }, [popupInfo])

  return (
    <div style={{height: '100vh'}}>
    <Map initialViewState={{
      longitude: -122.45,
      latitude: 37.78,
      zoom: 3,
    }}
    style={{position: 'relative'}}
    interactiveLayerIds={['data']}
    onClick={handlePointClick}
    mapStyle="mapbox://styles/aidash-ivms/ck92al8tf1z6d1ik4hup8wwp8"
    mapboxAccessToken={MAPBOX_TOKEN}>
      <Source id="data" type="geojson" data={data}>
        <Layer type="symbol"
  layout={{ "icon-image": "harbor-15" }} {...layerStyle} />
      </Source>

      {showPopup && (
       

          <div className="tooltip" style={{...tooltipStyle, left: popupInfo.points.x, top: popupInfo.points.y}}>
            <p>Here please, {popupInfo.properties.name}</p>
          </div>
        )}
    </Map>
    </div>
  );

  
}


// import * as React from 'react';
// import {useState, useMemo} from 'react';
// import {render} from 'react-dom';
// import Map, {
//   Marker,
//   Popup,
//   NavigationControl,
//   FullscreenControl,
//   ScaleControl,
//   GeolocateControl
// } from 'react-map-gl';

// // import ControlPanel from './control-panel';
// import Pin from './components/pin';

// import CITIES from './components/cities.json';

// const TOKEN = 'pk.eyJ1IjoiYWlkYXNoLWl2bXMiLCJhIjoiY2s5MmFoaXZkMDJqaTN0b3R0MXp2ZW9vaCJ9.vHhKgvClj48SJpFwjSdgug';

// export default function App() {
//   const [popupInfo, setPopupInfo] = useState(null);

//   const pins = useMemo(
//     () =>
//       CITIES.map((city, index) => (
//         <Marker
//           key={`marker-${index}`}
//           longitude={city.longitude}
//           latitude={city.latitude}
//           anchor="bottom"
//           style={{position: 'absolute'}}
//           onClick={e => {
//             // If we let the click event propagates to the map, it will immediately close the popup
//             // with `closeOnClick: true`
//             e.originalEvent.stopPropagation();
//             setPopupInfo(city);
//           }}
//         >
//           <Pin />
//         </Marker>
//       )),
//     []
//   );

//   return (
//     <div style={{height: '100vh'}}>
//       <Map
//         initialViewState={{
//           latitude: 37,
//           longitude: -95,
          
//         }}
        
//         mapStyle="mapbox://styles/aidash-ivms/ck92al8tf1z6d1ik4hup8wwp8"
//         mapboxAccessToken={TOKEN}
//       >
//         <GeolocateControl position="top-left" />
//         <FullscreenControl position="top-left" />
//         <NavigationControl position="top-left" />
//         <ScaleControl />

//         {pins}

//         {popupInfo && (
//           <Popup
//             anchor="top"
//             longitude={Number(popupInfo.longitude)}
//             latitude={Number(popupInfo.latitude)}
//             onClose={() => setPopupInfo(null)}
//           >
//             <div>
//               {popupInfo.city}, {popupInfo.state} |{' '}
//               <a
//                 target="_new"
//                 href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${popupInfo.city}, ${popupInfo.state}`}
//               >
//                 Wikipedia
//               </a>
//             </div>
//             <img width="100%" src={popupInfo.image} />
//           </Popup>
//         )}
//       </Map>

//       {/* <ControlPanel /> */}
//     </div>
//   );
// }