import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import {setDoc ,doc, Timestamp} from 'firebase/firestore'
import {useHistory} from 'react-router-dom'

import "./Login_Register.css";

const Register = () => {
const [data, setData] = useState({
  name: "",
  email:"",
  password: "",
  error:null,
  loading: false,
});

const history = useHistory();

const {name, email, password, error, loading} =data;

const handleChange = e => {
  setData({...data, [e.target.name]: e.target.value})
}

const handSubmit = async e =>{
  e.preventDefault();
  setData({...data, error: null, loading: true});
  if(!name || !email || !password ){
    setData({...data, error: "Please try again"});
  }
  try {
    const result = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
      );
    await setDoc(doc(db, "users", result.user.uid), {
      uid: result.user.uid,
      name,
      email,
      createdAt: Timestamp.fromDate(new Date()),
      isOnline: true,
    });
    setData({
      name:"", 
      email:"", 
      password:"", 
      error:null,
      loading:null
    });

    history.replace("/")
  } catch (err) {
    setData({ ...data,error: "Please try again", loading: false});
  }
}
  return (
  <section>
      <h1>Register</h1>
      <form className="form" onSubmit={handSubmit}>
        <div className="input_container">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={handleChange}/>
        </div>

        <div className="input_container">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" value={email} onChange={handleChange}/>
        </div>

        <div className="input_container">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={handleChange}/>
        </div>
          {error ? <p className="error">{error}</p>:null}
        <div className="btn_container">
            <button className="btn" disabled={loading}>{loading ? 'Register...' : 'Register'}</button>
        </div>

      </form>
  </section>
    );
};

export default Register;
