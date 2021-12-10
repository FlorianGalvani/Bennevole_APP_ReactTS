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
    const logoRef = useRef(null)



    return (
        <>
            <div className="secretVroom" id="secretVroom">
                <img src="./logo.png" alt="" />
            </div>

            <SearchBlock/>
            {appStatus === 'loading' && <Loading/>}
            {appStatus === 'failed' && <ErrorModal/>}
            <ReportModal/>
            {children}
        </>
    )
}
export default Layout
