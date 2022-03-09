import React, { useEffect, useState } from "react";
import Img from "../Images/profile.png";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import '../CSS/User.css'

const User = ({ user1, user, selectUser, chat }) => { //
  const user2 = user?.uid; //เช็คว่าเป็นผู้เข้าใช้คนไหน
  const [data, setData] = useState(""); //

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`; //
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <>
      <div
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}//user_wrapper ระยะห่างของแต่ละ User
        onClick={() => selectUser(user)} //ใช้คำสั่งคลิกที่ชื่อแชท เปรียบเทียบชื่อของผู้ใช้กับชื่อที่แสดงในแชทว่าใช่คนเดียวกันไหม และใช้คำสั่งselectUser เพื่อเลือกuserเพื่อสนทนา

      >
        <div className="user_info">
          <div className="user_detail">
            <img src={user.avatar || Img} alt="avatar" className="avatar" />
            <h4>{user.name}</h4>
            {data?.from !== user1 && data?.unread && (
              <small className="unread">ใหม่</small> //
            )}
          </div>
          <div
            className={`user_status ${user.isOnline ? "online" : "offline"}`} //คำสั่งเพื่อดูว่าuserมีการเข้าใช้งานอยู่ไหม ถ้าอยู่จะแสดงonline ถ้าไม่จะแสดงoffline
          ></div>
        </div>
        {data && (
          <p className="truncate">
            <strong>{data.from === user1 ? "Me:" : null}</strong>
            {data.text}
          </p>
        )}
      </div>
      <div
        onClick={() => selectUser(user)} //เมื่อเกิดการคลิกเพื่อใช้งานselectUser 
        className={`sm_container ${chat.name === user.name && "selected_user"}`}
      >
        <img
          src={user.avatar || Img}
          alt="avatar"
          className="avatar sm_screen"
        />
      </div>
    </>
  );
};

export default User;
