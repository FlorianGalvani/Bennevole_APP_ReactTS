/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {
    selectedCity,
    setAppStatus,
    setIdDumpster,
    setIsOpenReportModal, setSelectedCity
} from '../features/app/appSlice';
import axios from 'axios'
import { useTranslation } from 'react-i18next';
import {ImCross , ImHome3 } from 'react-icons/im'
import {FaHome} from 'react-icons/fa'



// Interfaces
import { ICity } from '../utils/interfaces'


import './Map.scss'

const lngs = {
    en: { nativeName: 'English' },
    fr: { nativeName: 'French' }
};

mapboxgl.accessToken = 'pk.eyJ1IjoibGVnaWxhbWFscyIsImEiOiJja21kNnp5dmEyaWl4MnVwMWNleDN3enhkIn0.TOMWAu7ep733glbYBZFSxA';

const MapComponent: React.FC = () => {
    const { t, i18n } = useTranslation();

    const dispatch = useAppDispatch();

    let mapContainer = useRef<any>();
    let map = useRef<mapboxgl.Map | null>(null);

    const [cities, setCities] = useState<Array<ICity>>([])
    // const [city, setCity] = useState<string>()

    const [zoom, setZoom] = useState<number>(5)

    const [markers, setMarkers] = useState<Array<any>>([]) // Use to stock

    const [userCoords, setUserCoords] = useState<Array<number>>([])

<<<<<<< HEAD
    const city = useAppSelector(selectedCity)
=======
    const [dumspterAdress, setDumspterAdress] = useState('')
>>>>>>> c55e048f7fdb606750c6510a82cab1b1d9fc04c5

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
                        // setCity(result.features[0].context[1].text);
                    }
                )
        });

        map.current.addControl(geocolateController, 'top-right');

        axios.get('http://localhost:8000/api/cities')
            .then((result) => {
                setCities(result.data)
                dispatch(setAppStatus('ok'))
            }).catch((err) => {
                dispatch(setAppStatus('failed'))
            })
    }, []);
    useEffect(() => {
        if (city === undefined) return
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
                    zoom: 10,
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
            <div className="optionMenu">
<<<<<<< HEAD

=======
                <FaHome/>
                <select name="city" id="citySelect" value={city} onChange={(e) => { if (e.target.value !== '') { setCity(e.target.value) } }}>
                    <option value="">{t('map.citySelector')}</option>
   
                   {cities.length > 0 && cities.map((city) => (
                        <option value={city.cityName} key={city.cityName}>
                            {city}
                        </option>
                    ))}
                </select>
>>>>>>> c55e048f7fdb606750c6510a82cab1b1d9fc04c5
                <div>
                    {Object.keys(lngs).map((lng) => (
                        <button key={lng} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(lng)}>
                            {lng}
                        </button>
                    ))}
                </div>
            </div>
            <div ref={mapContainer} className="map-container" />
        </div>
    )
}
export default MapComponent

