import React from 'react'

function ErrorModal() {
    return (
        <div className="ErrorModalContainer">
            <div className="ErrorModal">
                <p>Une erreur est survenue</p>
                <p>Veuillez <a href="">Recharger la page</a> ou essayer ulterierement</p>
            </div>
        </div>
    )
}

export default ErrorModal
