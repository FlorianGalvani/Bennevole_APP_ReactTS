import React, {useState} from 'react'

import ErrorModal from './components/ErrorModal'
import Loading from './components/Loading'
import ReportModal from './components/ReportModal'
import { useAppSelector} from '../app/hooks';


import './layout.css'
import {
    selectCount,
    selectCountIsOpenReportModal
  } from '../features/app/appSlice';

const Layout : React.FC =({children}) => {
    
    const [isOnError, setIsOnError] = useState(false)
    const appStatus = useAppSelector(selectCount);
    const IsOpenReportModal = useAppSelector(selectCountIsOpenReportModal);

    return (
        <>
            <div className="logo">
                <h1>Bennevole</h1>
            </div>
            {appStatus === 'loading' && <Loading/>}
            {appStatus === 'failed' && <ErrorModal/>}
            <ReportModal/>
            {children}
        </>
    )
}
export default Layout