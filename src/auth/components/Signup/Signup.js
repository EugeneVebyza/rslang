import React, { useState } from 'react';
import {
  Redirect,
  Link,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loggedSelector } from '../../redux/selectors';
import { signIn } from '../../redux';
import loginUser from '../../utils';
import styles from './SignUp.module.css';

const createUser = async (user) => {
  const url = 'https://afternoon-falls-25894.herokuapp.com/users';
  const rawResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (rawResponse.status !== 200) {
    throw new Error('Incorrect e-mail or password');
  }

  return true;
};

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isLogged = useSelector(loggedSelector);
  const dispatch = useDispatch();

  const submitHandler = (event) => {
    event.preventDefault();

    createUser({ 'email': email, 'password': password })
      .then(() => loginUser({ 'email': email, 'password': password }))
      .then(({ userId, token }) => {
        dispatch(signIn({ email, token, userId }));
      })
      .catch((er) => console.log(er));
  };

  return (
    <>
      {isLogged && <Redirect to="/" />}
      <form onSubmit={submitHandler} className={styles.Form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          pattern="[A-Za-z]{1,}"
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[+\-_@$!%*?&#.,;:[\]{}])(?=.*[A-Z]).{8,}"
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          required
        />
        <p className={styles.PasswordInfo}>
          Пароль должен содержать не менее 8 символов, как минимум одну
          прописную букву,одну заглавную букву, одну цифру и один спецсимвол из
          {'+-_@$!%*?&#.,;:[]{}'}
        </p>
        <button type="submit" className={styles.Button} id="button-create">
          Создать аккаунт
        </button>
        <Link
          className={styles.Link}
          to="/signin"
        >
          У меня есть аккаунт
        </Link>
      </form>
    </>
  );
};

export default SignUp;
