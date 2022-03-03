import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import {setDoc ,doc, Timestamp} from 'firebase/firestore'
import {useHistory} from 'react-router-dom'
import "../CSS/Login_Register.css";
import Logo from "../Images/LogoRegister.png";

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
    setData({...data, error: "กรุณาลองใหม่อีกครั้ง"});
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
    setData({ ...data,error: "กรุณาลองใหม่อีกครั้ง", loading: false});
  }
}
  return (
  <section>
      <h1>สมัครสมาชิกใหม่</h1>
      <img src={Logo} className="logo"></img>
      <form className="form" onSubmit={handSubmit}>
        <div className="input_container">
          <input type="text" name="name" placeholder="Username" value={name} onChange={handleChange}/>
        </div>

        <div className="input_container">
          <input type="text" name="email" placeholder="Email"value={email} onChange={handleChange}/>
        </div>

        <div className="input_container">
          <input type="password" name="password" placeholder="Password" value={password} onChange={handleChange}/>
        </div>
        <div className="btn_container" title="ยืนยันการลงทะเบียน">
            <button className="btn" disabled={loading}>{loading ? 'รอสักครู่' : 'ลงทะเบียน'}</button>
        </div>
        <strong>
        {error ? <p className="error">{error}</p>:null}
        </strong>
      </form>
  </section>
    );
};

export default Register;
