import React, { FormEvent, useEffect, useState } from 'react'
import './ReportModal.css'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import axios from 'axios';
import {
    setIsOpenReportModal,
    selectCountIsOpenReportModal,
    setIdDumpster,
    selectIdDumpster

} from '../../features/app/appSlice';

const ReportModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const [type, setType] = useState('')
    const [information, setInformation] = useState('')

    const [errorsType, setErrorsType] = useState('')
    const [errorsInfo, setErrorsInfo] = useState('')
    const dumpsterId = useAppSelector(selectIdDumpster)
    
    const  handleSubmit = async (evt:FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        let err = false
        if (type === '') {
            err = true
            setErrorsType('Veuillez selectioner un type d erreur');
        }
        if (information === '') {
            err = true
            setErrorsInfo('Veuillez renseigner ce champ');
            
        } 

        console.log(dumpsterId);
        
        if (dumpsterId === undefined) {
            err = true
            setErrorsInfo('Une erreur est survenue');
        }
        
        if (!err) {
            console.log(dumpsterId);
            
            await axios.post(`http://localhost:8000/api/report/${dumpsterId}`, {type: type, information:information}) 
             .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
        }
    }
  
    const IsOpenReportModal = useAppSelector(selectCountIsOpenReportModal);
    useEffect(() => {
        const ReportModal = document.getElementById('ReportModal')
        
        if (IsOpenReportModal) {
            ReportModal.style.bottom = '10vh'
        } else {
            ReportModal.style.bottom = '-80vh' 
        }
    }, [IsOpenReportModal])

    return (
        <div className="ReportModal" id="ReportModal">
            <div className="closeModal" onClick={() => dispatch(setIsOpenReportModal(false))}>X</div>
            <form onSubmit={handleSubmit} >
                <h3>Rapport d'erreur pour la benne </h3>
                
                {errorsType && <p>{errorsType}</p>}
                <select name="errorType" id="type" onChange={(e) => setType(e.target.value)}>
                    <option value="default"
                    >Veuillez selectionner le type d'erreur à reporter</option
                    >
                    <option value="errLoc"
                    >Erreur de localisation d'une benne/benne inexistante</option
                    >
                    <option value="errType"
                    >Cette benne ne correspond pas a son type</option
                    >
                </select>
                {errorsInfo && <p>{errorsInfo}</p>}
                <textarea
                    name="information"
                    id="information"
                    v-model="form.information"
                    cols={20}
                    rows={10}
                    onChange={(e) => setInformation(e.target.value)}
                ></textarea>
                <br />
                <input type="submit" value="Envoyer" />
            </form>
        </div>
    )
}

export default ReportModal
