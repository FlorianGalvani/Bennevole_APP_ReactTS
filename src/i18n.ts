import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: false,
        fallbackLng: 'fr',
        resources: {
            fr: {
                translation: {
                    loading: {
                        text: 'Chargement'
                    },
                    map: {
                        citySelector: 'Selectionnez votre vile',
                        markerError: 'Report an error'
                    },
                    errorModal: {
                        title: 'Une erreur est survenue',
                        message: 'Veuillez recharger la page ou si le probleme persiste essayer ulterierement',
                        reload: 'Recharger la page'
                    }
                }
            },
            en: {
                translation: {
                    loading: {
                        text: 'Loading'
                    },
                    map: {
                        citySelector: 'Select your city',
                        markerError: 'Report an error'

                    },
                    errorModal: {
                        title: 'An error occured',
                        message: 'Please reload the page or if the problem persists retry later',
                        reload: 'Reload the page'
                    }
                }
            }

        }
    });

export default i18n;