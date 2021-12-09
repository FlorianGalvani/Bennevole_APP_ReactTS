import React, {useState, useRef} from 'react'

import ErrorModal from './components/ErrorModal'
import Loading from './components/Loading'
import ReportModal from './components/ReportModal'
import { useAppSelector} from '../app/hooks';

import {
    selectAppStatus
  } from '../features/app/appSlice';
import SearchBlock from "./SearchBlock";


const Layout : React.FC =({children}) => {
    
    const appStatus = useAppSelector(selectAppStatus);
    const [secretState, setSecretState] = useState(1)
    const logoRef = useRef(null)

    function secrect(){
        if (secretState === 10) {
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
            <div className="secretVroom" id="secretVroom">
                <img src="./logo.png" alt="" />
            </div>

            <SearchBlock/>
            {/*<div ref={logoRef} className="logo" id="logo" onClick={() => secrect()}>*/}
            {/*    <h1>Bennevole</h1>*/}
            {/*</div>*/}
            {appStatus === 'loading' && <Loading/>}
            {appStatus === 'failed' && <ErrorModal/>}
            <ReportModal/>
            {children}
        </>
    )
}
export default Layout