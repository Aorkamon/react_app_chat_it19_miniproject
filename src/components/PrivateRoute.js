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
