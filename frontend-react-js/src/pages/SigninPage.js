import './SigninPage.css';
import React, { useState } from "react";
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { Link } from "react-router-dom";
import { Auth } from 'aws-amplify';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cognitoErrors, setCognitoErrors] = useState('');

  const onSubmit = async (event) => {
    setCognitoErrors('');
    event.preventDefault();
    try {
      Auth.signIn(email, password)
        .then(user => {
          localStorage.setItem("access_token", user.signInUserSession.accessToken.jwtToken);
          window.location.href = "/";
        })
        .catch(err => { console.log('Error!', err); });
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        window.location.href = "/confirm";
      }
      setCognitoErrors(error.message);
    }
  }

  const emailOnChange = (event) => {
    setEmail(event.target.value);
  }

  const passwordOnChange = (event) => {
    setPassword(event.target.value);
  }

  let errorElement;
  if (cognitoErrors) {
    errorElement = <div className='errors'>{cognitoErrors}</div>;
  }

  return (
    <article className="signin-article">
      <div className='signin-info'>
        <Logo className='logo' />
      </div>
      <div className='signin-wrapper'>
        <form
          className='signin_form'
          onSubmit={onSubmit}
        >
          <h2>Sign into your Cruddur account</h2>
          <div className='fields'>
            <div className='field text_field username'>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={emailOnChange}
              />
            </div>
            <div className='field text_field password'>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={passwordOnChange}
              />
            </div>
          </div>
          {errorElement}
          <div className='submit'>
            <Link to="/forgot" className="forgot-link">Forgot Password?</Link>
            <button type='submit'>Sign In</button>
          </div>
        </form>
        <div className="dont-have-an-account">
          <span>Don't have an account?</span>
          <Link to="/signup">Sign up!</Link>
        </div>
      </div>
    </article>
  );
}
