/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl';
// import Directions from '@mapbox/mapbox-gl-directions';
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    selectedCity,
    setAppStatus,
    setIdDumpster,
    setIsOpenReportModal,
    setSelectedCity
} from '../features/app/appSlice';
import axios from 'axios'

// Interfaces
import { ICity } from '../utils/interfaces'

mapboxgl.accessToken = 'pk.eyJ1IjoibGVnaWxhbWFscyIsImEiOiJja21kNnp5dmEyaWl4MnVwMWNleDN3enhkIn0.TOMWAu7ep733glbYBZFSxA';

const MapComponent: React.FC = () => {

    const dispatch = useAppDispatch();

    let mapContainer = useRef<any>();
    let map = useRef<mapboxgl.Map | null>(null);

    const [cities, setCities] = useState<Array<ICity>>([])
    // const [city, setCity] = useState<string>()

    const [zoom, setZoom] = useState<number>(5)

    const [markers, setMarkers] = useState<Array<any>>([]) // Use to stock

    const [userCoords, setUserCoords] = useState<Array<number>>([])

    const city = useAppSelector(selectedCity);
    const [dumspterAdress, setDumspterAdress] = useState('');

    useEffect(() => {

        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [2.483833000000004, 46.48293196437044],
            zoom: zoom,
            pitch: 15
        });
        const geocolateController = (
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true,
                showAccuracyCircle: false
            })
        );
        geocolateController.on('geolocate', (position: any) => {
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude + "," + position.coords.latitude}.json?limit=1&access_token=pk.eyJ1IjoibGVnaWxhbWFscyIsImEiOiJja21kNnp5dmEyaWl4MnVwMWNleDN3enhkIn0.TOMWAu7ep733glbYBZFSxA`)
                .then((res) => res.json())
                .then(
                    (result) => {
                        setUserCoords([position.coords.longitude, position.coords.latitude])
                        setZoom(15)
                        dispatch(setSelectedCity(result.features[0].context[1].text))
                    }
                )
        });

        map.current.addControl(geocolateController, 'top-right');

        axios.get('http://localhost:8000/api/cities')
            .then((result) => {
                setCities(result.data)
                setTimeout(() => {
                    dispatch(setAppStatus('ok'))

                }, 2000);
            }).catch((err) => {
                dispatch(setAppStatus('failed'))
            })
    }, []);

    useEffect(() => {
        if (city === '') return
        axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}, France}.json?limit=1&access_token=pk.eyJ1IjoibGVnaWxhbWFscyIsImEiOiJja21kNnp5dmEyaWl4MnVwMWNleDN3enhkIn0.TOMWAu7ep733glbYBZFSxA`
        )
            .then((result) => {
                const coords = result.data.features[0].center;
                map.current.flyTo({
                    center: [
                        coords[0],
                        coords[1]
                    ],
                    zoom: 13,
                    essential: true // this animation is considered essential with respect to prefers-reduced-motion
                });
            });
        axios.get(`http://localhost:8000/api/dumpsters/${city}`)
            .then((result) => {
                if (markers.length > 0) {
                    markers.forEach(element => {
                        element.remove()
                    });
                }
                // eslint-disable-next-line array-callback-return
                result.data.map((dumpster: any) => {
                    // Add an image to use as a custom marker
                    // create the popup
                    axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${dumpster.lng + "," + dumpster.lat}.json?limit=1&access_token=pk.eyJ1IjoibGVnaWxhbWFscyIsImEiOiJja21kNnp5dmEyaWl4MnVwMWNleDN3enhkIn0.TOMWAu7ep733glbYBZFSxA`)
                        .then((res) => {
                            dumpster.dumpsterAddress = res.data.features[0].place_name
                            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                                `<div class="box_text_popup"
                                <p class="popup_text"><img src="pin_gps.png" alt="gps">${dumpster.dumpsterAddress}</p>
                                </div>
                                <a id="reportButton" name="${dumpster.id}" style="background-color:#669b6b">Report</a>
                                `
                            )
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
                                    const navTo = document.getElementById('navigateTo')
                                    const id = reportButton.getAttribute('name')
                                    // const coords = [navTo.getAttribute('lon'), navTo.getAttribute('lat')]
                                    reportButton.addEventListener('click', () => {
                                        dispatch(setIdDumpster(id))
                                        dispatch(setIsOpenReportModal(true))
                                    })
                                })
                            })
                        })
                })
            })
    }, [city])
    return (
        <div className="mapComponent">
            <div ref={mapContainer} className="map-container" />
        </div>
    )
}
export default MapComponent

