import React, { useContext } from "react";//นำเข้าติดตั้งแพ็คเกจตัว react มาใช้งานร่วมใช้ context จาก react
import { Link } from "react-router-dom";//นำเข้าลิงค์จาก React Router คือ module ที่ทำหน้าที่ในการ Navigating หรือการเปลี่ยน page ไปมา
import { auth, db } from "../firebase"; //นำเข้า auth database จากบริการเว็บเซิร์ฟเวอร์ firebase
import { signOut } from "firebase/auth";//นำเข้า signout ตัวเข้าออกใช้ระบบจาก firebase/auth
import { updateDoc, doc } from "firebase/firestore"; //นำเข้าการอัพเดท doc เขตข้อมูลจากเอกสารที่ใช้ ปรับปรุงเอกสาร จากคลังเก็บ
import { AuthContext } from "../context/auth"; //นำเข้าการอัพเดท doc เขตข้อมูลจากเอกสารที่ใช้ ปรับปรุงเอกสาร จากคลังเก็บ
import { useHistory } from "react-router-dom"; //นำเข้าแพ็คเกจตัว authcontext ..ย้อนกลับ บริบท/รับรองความถูกต้อง
import '../CSS/Navbar.css'; //นำเข้าตัวแถบนำทาง Navbar.css จะจัดรูปแบบส่วนของ css นี้ใช้ตกแต่งหน้าตา UI ของเว็บไซต์
//JavaScript นั้นมีคำสั่งที่ทำงานแบบ asynchronous ก็คือเวลาที่เราสั่งงานอะไรไปแล้วถ้าเป็นงานที่ใช้เวลานาน มันก็จะไล่ไปทำคำสั่งถัดไปเลยโดยไม่ได้รอให้คำสั่งก่อนหน้าทำเสร็จ


const Navbar = () => { //const – ใช้สำหรับประกาศค่าตัวแปรที่ไม่ต้องการให้เปลี่ยนแปลงค่าได้ เพราะเมื่อประกาศค่าไปแล้วจะไม่สามรถแก้ไขค่านั้นซ้ำได้ โดย const นั้นทำงานภายใน block scope เหมือนกันกับ let
  const history = useHistory(); //useHistory กับ React Router ช่วยให้เข้าถึงเราเตอร์เพื่อนำทางจากภายในส่วนประกอบ
  const { user } = useContext(AuthContext); //ประกาศตัวแปร user จากนำเข้า react {useContext} แล้วเก็บค่าauthcontextไว้ในพารามิเตอร์()

  const handleSignout = async () => { //โดยการเขียน async ไว้หน้า function จะเป็นการระบุว่า function นั้นทำงานแบบ asynchronous 
    await updateDoc(doc(db, "users", auth.currentUser.uid), { //โดยการเรียก await นั้นจะสามารถใช้กับ function ได้ 2 แบบก็คือ function ที่ return ค่า Promise object และอีกแบบหนึ่งคือ async function
      isOnline: false, //จะแสดงเมื่อออนไลน์
    }); //await ใช้เพื่อบอกให้ JavaScript รอจนกว่าคำสั่งนั้นจะเสร็จ ถึงค่อยไปทำงานอันต่อไป โดยฟังก์ชันที่จะมี await อยู่ข้างในได้ต้องประกาศเป็น async เสมอ
    await signOut(auth); //syntax await
    history.replace("/login"); //จะมีการเขียนทับแทนที่ประวัติส่วนเข้าใช้งาน
  };
  return ( //nav(Navigation) element ใช้สำหรับจัดกลุ่มส่วนที่เป็นลิงค์ต่างๆ ไม่ว่าจะเป็นลิงค์ที่ไปยังไซต์อื่นๆ หรือลิงค์ที่ใช้เชื่อมโยงภายในหน้าเว็บเพจ (เช่นลิงค์ที่เมื่อคลิกแล้วเลื่อนไปแสดงยังส่วนต่างๆของหน้าเพจ) และที่สำคัญคือส่วนที่เป็นเมนูของเว็บไซต์
    <nav>
      <h3 title="คลิ้กเพื่อหน้าต่างเข้าสู่การสนทนาของคุณ">
        <Link to="/">- ข้อความของคุณ -</Link>
      </h3>
      <div>
        {user ? ( //Heading Tag คือ HTML Tag ใช้สำหรับกำหนดหัวข้อต่างๆ ของหน้าเพจว่าอะไรคือหัวข้อหลัก อะไรคือหัวข้อรองในหน้าเพจนั้น โดย Heading Tag จะมีตั้งแต่ H1 จนถึง H6 ด้วยกัน
        //div ใช้สำหรับครอบวัตถุที่เราต้องการ เพื่อจัดรูปแบบต่างๆ ให้กับวัตถุในตำแหน่งนั้นๆ สามารถใส่ค่าไปตรงๆ ใน div นั้น หรือ ใส่ id กับ class เพื่อใช้อ้างอิงกับการจัด CSS ได้ตามความเหมาะสม
          <div>
            <Link to="/profile" title="คลิ้ก เพื่อเข้าสู่หน้าต่างโปรไฟล์ของคุณ (สามารถเปลี่ยนรูปโปรไฟล์ของคุณได้ที่นี้)" >โปรไฟล์</Link>
            <button className="btnNav" title="ออกจากระบบการใช้งาน" onClick={handleSignout} >ออกจากระบบ</button>
          </div>
        ) : (
          <>
            <label title="หากคุณยังไม่มีแอคเคาท์ สามารถสมัครสมาชิกใหม่ได้ที่นี้" >
            <Link to="/register">สมัครสมาชิก</Link>
            </label>
            <label title="ลงชื่อเพื่อเข้าใช้งานระบบ">
            <Link to="/login">ลงชื่อเข้าใช้</Link>
            </label>
          </>
        )}
      </div>
    </nav>
  ); //แท็ก <label> หน้าฉลากครอบข้อความที่วางไว้อยู่หน้าช่องแบบฟอร์ม
};

export default Navbar; //ส่งออกค่าเริ่มต้นของแถบนำทาง
