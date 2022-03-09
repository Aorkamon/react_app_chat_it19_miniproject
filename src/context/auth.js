import { createContext, useEffect, useState } from "react"; //คือการ Import module จาก react ตัวติดตั้ง
import { onAuthStateChanged } from "firebase/auth";// คำสั่งที่ใช้ในการตรวจเช็ค เมื่อมีผู้ใช้เข้าสู่ระบบ
import { auth } from "../firebase";//ตัวแปรที่กำหนดไว้ ของคีย์ auth
import Loading from "../components/Loading";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); //สร้างตัวแปร โดยใช้useState สร้างตัวแปร user และฟังก์ชั่น setUser และกำหนดค่าเริ่มต้นเป็น user เป็น null
  const [loading, setLoading] = useState(true); //กำหนดค่าเริ่มต้นของ loading เป็น true

  useEffect(() => {
    onAuthStateChanged(auth, (user) => { //คำสั่งในการตรวจสอบว่ามีผู้ใช้เข้าสู่ระบบ หากมีการเข้าสู่ระบบจากผู้ใช้
      setUser(user);//ให้ทำการเซตค่า user เป็น user ของผู้ที่เข้าสู่ระบบ
      setLoading(false);// และเซตค่า loading เป็น false 
      //setLoading เป็นฟังก์ชั่นที่ใช้ในการอ้างอิงสำหรับ useEffect เพื่อกระทำการใดๆสำหรับตัวแปร loading ที่เรากำหนดไว้ในบรรทัดที่ 10
    });
  }, []);

  if (loading) { //หากค่า loading เป็นจริงให้แสดงหน้า loading
    return <Loading />;
  }
  
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider; //คือการ export ตัว Component App เพื่อเอาไปใช้
