import React,{Fragment} from 'react'

const NotFound = () => {
    return (
        <Fragment>
            <h1 className="x-large text-primary">
                <i className="fas fa-exclamation-triangle"></i> Страница не найдена!
            </h1>
            <p className="large">Извините, такая страница не существует.</p>
        </Fragment>
    )
}

export default NotFound