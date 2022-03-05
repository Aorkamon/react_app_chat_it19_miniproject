import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase' // auth และ db คือตัวแปรที่ทำการนำรหัสคีย์เข้ามาจาก firebase
import {updateDoc, doc} from 'firebase/firestore'//ทดสอบ
import {useHistory} from 'react-router-dom'
import '../CSS/Login_Register.css'
import Logo from "../Images/LogoLogin.png";

const Login = () => {
const [data, setData] = useState({
  email:"",
  password: "",
  error:null,
  loading: false,
});
const history = useHistory();

const {email, password, error, loading} =data;

const handleChange = e => {
  setData({...data, [e.target.name]: e.target.value})
}

const handleSubmit = async (e) =>{
  e.preventDefault();
  setData({...data, error: null, loading: true});
  if(!email || !password ){
    setData({...data, error: "กรุณากรอกข้อมูลใหม่อีกครั้ง"});
  }
  try {
    const result = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
      );
    await updateDoc(doc(db, 'users', result.user.uid), {
      isOnline: true,
    });
    setData({ 
      email:"", 
      password:"", 
      error:null,
      loading:null
    });

    history.replace("/");
  } catch (err) {
    setData({...data,error: "กรุณากรอกข้อมูลใหม่อีกครั้ง", loading: false});
  }
};
  return (
  <section>
      <h1>ลงชื่อเข้าใช้</h1>
      <img src={Logo} className="logo"></img>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input_container">
          <input type="text" name="email" placeholder="Email" value={email} onChange={handleChange}/>
        </div>

        <div className="input_container">
          <input type="password" name="password" placeholder="Password" value={password} onChange={handleChange}/>
        </div>
          
        <div className="btn_container" title="ยืนยันลงชื่อเข้าใช้งาน">
            <button className="btn" disabled={loading}>{loading ? "รอสักครู่":'ลงชื่อเข้าใช้' }</button>
        </div>
        <strong>
        {error ? <p className="error">{error}</p>:null}
        </strong>
      </form>
  </section>
    );
};

export default Login;
