import React, { FormEvent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import {
    setIsOpenReportModal,
    selectIsOpenReportModal,
    selectIdDumpster

} from '../../features/app/appSlice';
import { useTranslation } from 'react-i18next';

const ReportModal: React.FC = () => {
    // Initialisation de la modification des données dans le store
    const dispatch = useAppDispatch();
    // Recuperation des données dans le store 
    const dumpsterId = useAppSelector(selectIdDumpster)
    const IsOpenReportModal = useAppSelector(selectIsOpenReportModal);
    // Initialisation des Hook d'états du composent actuel (ReportModal)
    const [type, setType] = useState('')
    const [information, setInformation] = useState('')
    const [errorsType, setErrorsType] = useState('')
    const [errorsInfo, setErrorsInfo] = useState('')

    const { t, i18n } = useTranslation();

    // Gestion de l'evenement d'envoi (submit) du formulaire de rapport d'erreur 
    const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
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
        if (dumpsterId === undefined) {
            err = true
            setErrorsInfo('Une erreur est survenue');
        }
        if (!err) {
            await axios.post(`http://localhost:8000/api/report/${dumpsterId}`, { type: type, information: information })
                .then(function (response) {

                    dispatch(setIsOpenReportModal(false))
                })
                .catch(function (error) {
                });
        }
    }
    
    useEffect(() => {
        const ReportModal = document.getElementById('ReportModal')
        if (IsOpenReportModal) {
            ReportModal.style.bottom = '10vh'
        } else {
            ReportModal.style.bottom = '-81vh' 
        }
    }, [IsOpenReportModal])

    return (
        <div className="ReportModal" id="ReportModal">
            <form onSubmit={handleSubmit} >
                <IoClose className="closeModal" onClick={() => dispatch(setIsOpenReportModal(false))} />
                <h3>Rapport d'erreur</h3>
                {errorsType && <p>{errorsType}</p>}
                <div className="select">
                <select name="errorType" className="errorType" id="type" onChange={(e) => setType(e.target.value)}>
                    <option value="default">Type d'erreur</option>
                    <option value="errLoc"
                    >Erreur de localisation d'une benne/benne inexistante</option
                    >
                    <option value="errType"
                    >Cette benne ne correspond pas a son type</option
                    >
                </select>
                 <div className="select_arrow">
                 </div>
                </div>
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
                <input className="btn_modal" type="submit" value="Envoyer" />
            </form>
        </div>
    )
}

export default ReportModal
