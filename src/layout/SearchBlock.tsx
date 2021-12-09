import React, {ChangeEventHandler, useEffect, useRef, useState} from 'react';
import "./SearchBlock.scss";
import axios from "axios";
import { useAppDispatch } from '../app/hooks';
import {setSelectedCity} from "../features/app/appSlice";

export default function SearchBlock() {

    const dispatch = useAppDispatch();
    const [data, setData] = useState([]);
    const [barVisibility, setBarVisibility] = useState("");

    useEffect(() => {

        axios.get('http://localhost:8000/api/cities')
            .then((result) => {
                setData(result.data);
            })
    }, []);

    const disptachCity = (e: any) => {
        dispatch(setSelectedCity(e.target.value));

        handleVisibility();
    }

    const handleVisibility = () => {
        if (barVisibility === "hideBar") {
            setBarVisibility("");
        } else if (barVisibility === "") {
            setBarVisibility("hideBar")
        }

    }

    return (
        <>
            <div className={`searchBlock ${barVisibility}`}>
                <div className="searchContainer">
                    <div className="bar" onClick={handleVisibility}></div>
                    <h1>Bennevole</h1>
                    <p>L'application qui vous permet de trouver les bennes proches de chez vous !</p>

                    <div className="searchBarContainer">
                        <select
                            name="city"
                            id="citySelect"
                            onChange={disptachCity}
                        >
                            <option>---</option>

                            {data
                                .map((ville) => (
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
