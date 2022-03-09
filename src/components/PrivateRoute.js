import React, { useContext } from "react"; //คือการ Import module 
import { AuthContext } from "../context/auth"; //นำเข้า authcontext มาเก็บไว้จากโฟลเดอร์ context ไฟล์ auth.js
import { Redirect, Route } from "react-router-dom"; //นำเข้า ตัวชี้ direct จาก react route dom
//React-roter-dom คือการที่ทำให้ app มีเพจหลายหน้า React router ติดต่อกับ React เพื่อบอกว่าจะต้องแสดงคอมโพเนนต์ใดบ้างและต้องแสดงอย่างไร
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      exact
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};
//Props ใน React ข้อดีคือ เราสามารถส่งข้อมูลจาก Component หนึ่งไปอีก Component ได้ด้วยการใช้ Props
//Props Properties หากเปรียบกับ HTML แล้ว ตัว Props จะเป็นคล้ายๆ attributes ของ HTML ดัง เช่น src, href หรือ class

export default PrivateRoute; //คือการ export ตัว Component PrivateRoute เพื่อเอาไปใช้
//ค่าเริ่มต้นส่งออก ชื่อที่จะอ้างถึงการส่งออกเริ่มต้นจากโมดูล
/*React Router เป็นหนึ่งในองค์ประกอบที่สำคัญที่สุดของ React Ecosystem โดยมีส่วนประกอบต่อไปนี้:
บ้าน: เส้นทางสาธารณะที่ทุกคนสามารถเข้าถึงได้
แดชบอร์ด: เส้นทางส่วนตัวที่เฉพาะผู้ใช้ที่ได้รับการพิสูจน์ตัวตนเท่านั้นที่สามารถเข้าถึงได้
การลงชื่อเข้าใช้: เส้นทางที่ จำกัด ซึ่งผู้ใช้ที่ไม่ได้รับการพิสูจน์ตัวตนสามารถมองเห็นได้ 
เพื่ออธิบายเพิ่มเติมเราไม่ต้องการแสดงหน้าลงชื่อเข้าใช้หลังจากลงชื่อเข้าใช้ไซต์ 
หากผู้ใช้ที่ได้รับอนุญาตไปที่หน้าลงชื่อเข้าใช้เราจะเปลี่ยนเส้นทางไปที่หน้าแดชบอร์ด*/

/*เส้นทางส่วนตัว คอมโพเนนต์ PrivateRoute คือพิมพ์เขียวสำหรับเส้นทางส่วนตัวทั้งหมดในแอปพลิเคชัน 
หากผู้ใช้เข้าสู่ระบบให้ไปและแสดงส่วนประกอบที่เป็นปัญหา มิฉะนั้นให้เปลี่ยนเส้นทางผู้ใช้ไปที่หน้าลงชื่อเข้าใช้ 
นอกจากนี้เราสามารถกำหนดตรรกะของ user ฟังก์ชันยูทิลิตี้แยกกันในauthโฟลเดอร์*/