import React from 'react'

function ErrorModal() {
    return (
        <div className="ErrorModalContainer">
            <div className="ErrorModal">
                <img src="./SmylingDumpsterOnfire.png" alt="errorDumpster" />
                <h1>Une erreur est survenue </h1>
                <p>Veuillez recharger la page ou si le probleme persiste essayer ulterierement</p>
                <button onClick={() => window.location.reload()}>Recharger la page</button>
            </div>
        </div>
    )
}

export default ErrorModal
