import React , {Fragment , useState} from 'react'
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux' ;   
import PropTypes from 'prop-types';
import {login} from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const {email,password} = formData;
    const onChange = e => setFormData({...formData, [e.target.name] : e.target.value});
    const onSubmit = e => {
        e.preventDefault();
        login(email,password);
    }
     
    if(isAuthenticated) return <Redirect to='/posts'/>

    return <Fragment>
      <div className="login-form">
           <h1 className="large text-primary">Авторизация</h1>
      <p className="lead"><i className="fas fa-user"></i> Войдите в свой профиль</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="email" 
                 placeholder="Email" 
                 name="email" 
                 value={email} 
                 onChange={e=> onChange(e)} 
                 required/>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Пароль"
            name="password"
            value={password} 
            onChange={e=> onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Войти" />
      </form>
      <p className="my-1">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
      </div>
        </Fragment>;
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps,{login})(Login);
