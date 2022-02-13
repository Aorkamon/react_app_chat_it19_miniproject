import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/auth";
import { useHistory } from "react-router-dom";
import './Navbar.css';


const Navbar = () => {
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    history.replace("/login");
  };
  return (
    <nav>
      <h3 title="คลิ้กเพื่อหน้าต่างเข้าสู่การสนทนาของคุณ">
        <Link to="/">- ข้อความของคุณ -</Link>
      </h3>
      <div>
        {user ? (
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
  );
};

export default Navbar;
