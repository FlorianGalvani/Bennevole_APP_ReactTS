import React, { useEffect, useState} from 'react';
import axios from "axios";
import { useAppDispatch } from '../app/hooks';
import {setSelectedCity} from "../features/app/appSlice";

export default function SearchBlock() {

    const dispatch = useAppDispatch();
    const [cities, setCities] = useState([]);
    const [barVisibility, setBarVisibility] = useState("");
    const [secretState, setSecretState] = useState(1)

    const [audio] = useState(new Audio('./tutut.mp3'));


    useEffect(() => {
        axios.get('http://localhost:8000/api/cities')
            .then((result) => {
                
                setCities(result.data);
            })
    }, []);

    const disptachCity = (e: any) => {
        dispatch(setSelectedCity(e.target.value));

        if (barVisibility === "") handleVisibility();
    }

    const handleVisibility = () => {
        if (barVisibility === "hideBar") {
            setBarVisibility("");
        } else if (barVisibility === "") {
            setBarVisibility("hideBar")
        }

    }

    function secrect(){
        if (secretState === 10) {
            audio.play()

            document.getElementById('secretVroom').style.right = "600px"
            setTimeout(() => {
                document.getElementById('secretVroom').style.transition = "none"
                document.getElementById('secretVroom').style.right = "-600px"

            }, 2000);
        } else {
            setSecretState(secretState + 1)
        }
         
    }

    return (
        <>
            <div className={`searchBlock ${barVisibility}`}>
                <div className="searchContainer">
                    <div className="bar" onClick={handleVisibility}></div>
                    <h1 onClick={() => secrect()}>Bennevole</h1>
                    <p>L'application qui vous permet de trouver les bennes proches de chez vous !</p>

                    <div className="searchBarContainer">
                        <select
                            name="city"
                            id="citySelect"
                            onChange={disptachCity}
                        >
                            <option>- Choisir ville -</option>

                            {cities.map((ville) => (
                                    <option
                                        value={ville}
                                        key={ville}
                                    >
                                        {ville}
                                    </option>
                                ))}

                        </select>
                    </div>

                </div>
            </div>
        </>
    );
}
