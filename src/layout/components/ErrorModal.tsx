import React from 'react'
import { useTranslation } from 'react-i18next';


const lngs = {
    en: { nativeName: 'English' },
    fr: { nativeName: 'French' }
};

function ErrorModal() {
    const { t, i18n } = useTranslation();

    return (
        <div className="ErrorModalContainer">
            <div className="ErrorModal">
                <div>
                    {Object.keys(lngs).map((lng) => (
                        <button key={lng} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(lng)}>
                            {lng}
                        </button>
                    ))}
                </div>
                <img src="./SmylingDumpsterOnfire.png" alt="errorDumpster" />
                <h1>{t('errorModal.title')}</h1>
                <p>{t('errorModal.message')}</p>
                <button onClick={() => window.location.reload()}>{t('errorModal.reload')}</button>
                {/* <a href="/">{t('errorModal.reload')}</a> */}
            </div>
        </div>
    )
}

export default ErrorModal
