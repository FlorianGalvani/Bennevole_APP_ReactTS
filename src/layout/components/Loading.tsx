import { t } from 'i18next'
import React from 'react'
import './Loading.scss'
const Loading: React.FC = () => {
    return (
        <div className="Loading">
            <p>{t('loading.text')}</p>
        </div>
    )
}
export default Loading