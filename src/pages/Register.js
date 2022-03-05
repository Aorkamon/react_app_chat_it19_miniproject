import React, { useState } from 'react'; 
import { createUserWithEmailAndPassword } from 'firebase/auth' //ใช้คำสั่งมาจาก firebase
import { auth, db } from '../firebase'  // auth และ db คือตัวแปรที่ทำการนำรหัสคีย์เข้ามาจาก firebase 
import {setDoc ,doc, Timestamp} from 'firebase/firestore'
import {useHistory} from 'react-router-dom'
import "../CSS/Login_Register.css";
import Logo from "../Images/LogoRegister.png";

const Register = () => {
const [data, setData] = useState({//คำสั่งในการสร้างตัวแปรของ data โดยใช้ useState โดยที่ค่า defalut ของ data เป็น
  name: "",//ตัวแปร name เป็นค่า null
  email:"",
  password: "",
  error:null,
  loading: false,//loading เป็น false เพื่อหยุดการแสดงหน้าจอ loading
});

const history = useHistory();//คำสั่งเข้าถึงฟังก์ชันต่างๆเพื่อนำทางไปยังหน้าเว็ปอื่นๆได้ แต่มีการกำหนดเงื่อนไขในการเข้าถึงหน้าเว็ปนั้นๆ

const {name, email, password, error, loading} = data;//เป็นการสร้างตัวแปรที่อยู๋ใน data เพื่อนำข้อมูลนี้ไปใช้ในการอ้างอิงเพื่อทำการเปรียบเทียบ

const handleChange = e => {
  setData({...data, [e.target.name]: e.target.value})//คำสั่งในการพิมพ์ข้อมูลเมื่อมีการพิมพ์ข้อความ ซึ่งอยู่ในขอบเขตของตัวแปร data ที่จะเก็บข้อมูลนี้
}
const handSubmit = async e =>{//คำสั่งเมื่อการกดปุ่มยืนยันการลงทะเบียน
  e.preventDefault();//คำสั่งป้องกันไม่ให้ตัว Browser มีการ Reload หรือ refesh ถ้าไม่ใส่คำสั่งนี้ เมื้อกดปุ่มยันยันแล้ว Browser จะมีการ refesh หน้าตัวเอง

  setData({...data, error: null, loading: true});
  //คำสั่งในการกำหนดค่าให้กับตัวแปร data ที่มีการสร้างโดย useState ให้ ดึงข้อมูลมาจากค่าที่กำหนด และให้เซต Error เป็น null และเซตค่า Loading เป็น null
  
  if(!name || !email || !password ){//คำสั่งในการตรวจเช็คเงื่อนไขถ้าหากว่า ถ้าหากไม่มีการใส่ข้อมูลให้ครบถ้วน
    setData({...data, error: "กรุณาลองใหม่อีกครั้ง"});
    //ให้แสดงข้อความ error ว่า "กรุณาลองใหม่อีกครั้ง"
  }
  try {//คำสั่งในการจัดการและตรวจสอบกับข้อผิดพลาด

    setData({//กำหนดข้อมูลของ data ให้เป็น null
      name:"", //name เป็นค่า null
      email:"", 
      password:"", 
      error:null,
      loading:null
    });

    const result = await createUserWithEmailAndPassword( //สร้างตัวแปร result และในคำสั่งของ firebase/auth ในการสร้างบัญชีผู้ใช้งานด้วย email และ password
      auth, //เป็นการอ้างอิงถึงตัวคีย์ของ auth ที่เรากำหนดชื่อตัวเแปรเป็น auth
      email, 
      password
      );

      //การใส่ await เป็นการรอให้คำสั่งตัวที่มี await ทำงานให่เสร็จก่อนแล้วจึงค่อยทำคำสั่งต่อไป

    await setDoc(doc(db, "users", result.user.uid), { //เป็นการเพิ่มข้อมูลลงใน cloud firebase ลงใน collection ชื่อว่า user
      uid: result.user.uid,//เป็นค่าเฉพาะตัวของผู้ใช้ firebase จะกำหนดมาให้ซึ่งจะคล้ายๆ กับ ข้อมูลฟิลด์แบบ Primary key ที่ใช้ในการอ้างอิง
      name,
      email,
      createdAt: Timestamp.fromDate(new Date()),//คำสั่งในการบันทึกเวลาที่มีการจัดเก็บข้อมูล
      isOnline: true,//ตั้งสถานะของผู้ใช้ให้เป็น ออนไลน์
    });

    history.replace("/");//เป็นการป้องกันไม่ให้กลับไปหน้าก่อนหน้าเมื่อกี่ เมื่อเข้าสู่ระบบมาแล้ว ก็จะไม่สามารถกลับไปหน้าลงทะเบียน หรือเข้าใช้งานได้ ในหน้า home หรือหน้า /

  } catch (err) { 
    setData({ ...data,error: "กรุณาลองใหม่อีกครั้ง", loading: false});
    //หากเกิด error ให้ทำการแสดงข้อความ "กรุณาลองใหม่อีกครั้ง"
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
          <input type="text" name="email" placeholder="Email" value={email} onChange={handleChange}/>
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
