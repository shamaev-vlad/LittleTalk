import React, {Fragment, useEffect} from 'react'
import Spinner from '../layout/Spinner'
import ProfileItem from '../profiles/ProfileItem'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getAllProfiles} from '../../actions/profile'
import {FaUser} from 'react-icons/fa'


const Profiles = ({getAllProfiles , profile: { profiles, loading}}) => {
    useEffect(()=>{
        getAllProfiles();
    },[getAllProfiles]);

    return (
        <Fragment>
            {loading ? <Spinner/> : <Fragment>
                <h1 className="large text-primary">Пользователи</h1>
                <p className="lead">
                    <FaUser />Просмотр пользователей
                </p>
                <div className="profiles">
                    {profiles.length > 0 ? (
                        profiles.map(profile=> (
                            <ProfileItem key={profile._id} profile={profile}/>
                        ))
                    ) : (<h4>Пользователи не найдены</h4>)}
                </div>
                </Fragment>}
        </Fragment>
    )
}

Profiles.propTypes = {
    getAllProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})


export default connect(mapStateToProps,{getAllProfiles})(Profiles);
