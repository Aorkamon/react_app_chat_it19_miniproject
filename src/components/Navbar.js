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
      <h3>
        <Link to="/">- ข้อความของคุณ -</Link>
      </h3>
      <div>
        {user ? (
          <>
            <Link to="/profile">โปรไฟล์</Link>
            <button className="btnNav" onClick={handleSignout}>ออกจากระบบ</button>
          </>
        ) : (
          <>
            <Link to="/register">สมัครสมาชิก</Link>
            <Link to="/login">ลงชื่อเข้าใช้</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
