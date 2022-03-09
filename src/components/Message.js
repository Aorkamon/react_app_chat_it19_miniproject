import React, { useRef, useEffect } from "react";
import Moment from "react-moment";
import '../CSS/Message.css';
import 'moment/locale/th';

const Message = ({ msg, user1 }) => {
  const scrollRef = useRef(); //useref ใช้ในการอ้างอิงเพื่อใช้หาค่าปัจจุบัน

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);//current เพื่อใช้หาค่าปัจจุบันของข้อความ โดยใช้คำสั่ง svroolIntoView
  // === ใช้ในการเปรียบเทียบความเหมือนกัน/เป็นอย่างเดียวกัน (identically)
  return (
    <div
      className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
      ref={scrollRef}
    >
      <p className={msg.from === user1 ? "me" : "friend"} >
        {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
        {msg.text}
        <br/>
        <small>
        <Moment format='Do MMMM YYYY HH:mm' fromDate>{msg.createdAt.toDate().toString()}</Moment>
        </small> 
      </p> 
    </div>
  );
};

export default Message;
