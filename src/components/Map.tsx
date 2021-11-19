/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl/';
import "mapbox-gl/dist/mapbox-gl.css";

import './Map.css'
import { ICity, IDumpster } from '../utils/interfaces'
import { useAppDispatch } from '../app/hooks';
import {
    setAppStatus,
    setIdDumpster,
    setIsOpenReportModal
} from '../features/app/appSlice';

mapboxgl.accessToken = 'pk.eyJ1IjoibGVnaWxhbWFscyIsImEiOiJja21kNnp5dmEyaWl4MnVwMWNleDN3enhkIn0.TOMWAu7ep733glbYBZFSxA';

const MapComponent: React.FC = () => {

    const dispatch = useAppDispatch();

    let mapContainer = useRef<any>();
    let map = useRef<mapboxgl.Map | null>(null);

    const [cities, setCities] = useState<Array<ICity>>([])
    const [city, setCity] = useState<string>()

    const [markers, setMarkers] = useState<Array<any>>([]) // Use to stock

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [2.483833000000004, 46.48293196437044],
            zoom: 5,
            pitch: 15
        });
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true
            }),
            'bottom-left'
        );


        fetch('http://localhost:8000/api/cities')
            .then(response => response.json())
            .then((result) => {
                setCities(result)
                dispatch(setAppStatus('ok'))

            }).catch((err) => {
                console.log('There is an error in fetching', err);
                dispatch(setAppStatus('failed'))


            })
    }, []);

    useEffect(() => {
        if (city === undefined) return
        fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${city + ", France"
            }.json?limit=1&access_token=pk.eyJ1IjoibGVnaWxhbWFscyIsImEiOiJja21kNnp5dmEyaWl4MnVwMWNleDN3enhkIn0.TOMWAu7ep733glbYBZFSxA`
        )
            .then((response) => response.json())
            .then((result) => {
                const coords = result.features[0].center;
                map.current.flyTo({
                    center: [
                        coords[0],
                        coords[1]
                    ],
                    zoom:10,
                    essential: true // this animation is considered essential with respect to prefers-reduced-motion
                });

            });
        fetch(`http://localhost:8000/api/dumpsters/${city}`)
            .then((res) => res.json())
            .then((result) => {
                if (markers.length > 0) {
                    markers.forEach(element => {
                        element.remove()
                    });
                }
                // eslint-disable-next-line array-callback-return
                result.map((dumpster: any) => {
                    console.log(dumpster);

                    // Add an image to use as a custom marker
                    // create the popup
                    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<a id="reportButton" name="${dumpster.id}">Report error</a>`)
                    // create DOM element for the marker
                    const el = document.createElement('div');
                    el.id = `marker_${dumpster.id}`;
                    // // create the marker
                    const marker = new mapboxgl.Marker(el)
                        .setLngLat([dumpster.lng, dumpster.lat])
                        .setPopup(popup) // sets a popup on this marker
                        .addTo(map.current);

                    markers.push(marker)
                    marker.getElement().addEventListener('click', (e) => {
                        setTimeout(() => {
                            const reportButton = document.getElementById('reportButton')
                            const id = reportButton.getAttribute('name')

                            reportButton.addEventListener('click', () => {

                                dispatch(setIdDumpster(id))
                                console.log('id is : ', id)
                                dispatch(setIsOpenReportModal(true))

                            })

                        })
                    })
                })


            })

    }, [city])

    return (
        <div className="mapComponent">
            <div className="optionMenu">
                <select name="city" id="citySelect" onChange={(e) => { if (e.target.value !== '') { setCity(e.target.value) } }}>
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                        <option value={city.toString()} key={city.toString()}>
                            {city}
                        </option>
                    ))}
                </select>
                {/* <select name="mapStyle" id="mapStyleSelect">
                    <option value="satelite">Satelite View</option>
                </select> */}

            </div>
            <div ref={mapContainer} className="map-container" />

        </div>

    )
}
export default MapComponent

