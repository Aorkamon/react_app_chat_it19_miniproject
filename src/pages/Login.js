import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'  // auth และ db คือตัวแปรที่ทำการนำรหัสคีย์เข้ามาจาก firebase
import {updateDoc, doc} from 'firebase/firestore'
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

const {email, password, error, loading} = data;//เป็นการสร้างตัวแปรที่อยู๋ใน data เพื่อนำข้อมูลนี้ไปใช้ในการอ้างอิงเพื่อทำการเปรียบเทียบ

const history = useHistory();//คำสั่งเข้าถึงฟังก์ชันต่างๆเพื่อนำทางไปยังหน้าเว็ปอื่นๆได้ แต่มีการกำหนดเงื่อนไขในการเข้าถึงหน้าเว็ปนั้นๆ

const handleChange = e => {
  setData({...data, [e.target.name]: e.target.value})//คำสั่งในการพิมพ์ข้อมูลเมื่อมีการพิมพ์ข้อความ
}

const handleSubmit = async (e) =>{
  e.preventDefault();

  setData({...data, error: null, loading: true});
  if(!email || !password ){
    setData({...data, error: "กรุณากรอกข้อมูลใหม่อีกครั้ง"});
  }
  try {//คำสั่งในการจัดการและตรวจสอบกับข้อผิดพลาด

    setData({//กำหนดข้อมูลของ data ให้เป็น null
      email:"",
      password:"",
      error:null,
      loading:null
    });

    const result = await signInWithEmailAndPassword(//คำสั่งในการเข้าสู่ระบบของผู้ใช้จาก firebase/auth
      auth, 
      email, 
      password
      );

    await updateDoc(doc(db, 'users', result.user.uid), {//คำสั่งในการเปลี่ยนแปลงข้อมูลใน cloud firebase โดยอาศัยข้อมูลที่เข้าสู่ระบบมาแล้ว
      isOnline: true,//เปลี่ยนแปลงสถานะให้เป็น ออนไลน์
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
