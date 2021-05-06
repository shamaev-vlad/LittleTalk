import React, { Fragment } from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth';
import {FaComments} from 'react-icons/fa';

const Navbar = ({ auth: {isAuthenticated, loading}, logout}) => {
    const authLinks = (
    <ul>
      <li><Link to="/profiles">Пользователи</Link></li>
      <li><Link to="/posts">Посты</Link></li>
      <li><Link to="/dashboard">
        <i className="fas fa-user"></i>{' '}
          <span className="hide-sm">Профиль</span> 
          </Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className="fas fa-sign-out-alt"></i>{' '}
           <span className="hide-sm">Выйти</span> 
       </a>
     </li>
    </ul>
    );
    const guestLinks = (
      <ul>
      <li><Link to="/profiles">Пользователи</Link></li>
      <li><Link to="/register">Зарегистрироваться</Link></li>
      <li><Link to="/login">Войти</Link></li>
    </ul>
    );
    return (
        <nav className="navbar bg-dark">
        <h1>
        <Link to='/'>
       LittleTalk <FaComments />
      </Link>
        </h1>
    { !loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>) }
      </nav>
    )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state =>({
  auth: state.auth
});

export default connect(mapStateToProps,{logout}) (Navbar);
