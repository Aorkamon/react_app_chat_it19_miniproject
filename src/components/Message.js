import React, { useRef, useEffect, useState } from "react";
import Moment from "react-moment";
import '../CSS/Message.css';
import 'moment/locale/th';
import Line from "../components/svg/Line";



const Message = ({ msg, user1 }) => { //เรียกใช้ตัวแปรจากCPN Home มาใช้ในmessage 2ตัว msg(ข้อความ), user1(ผู้ที่เข้าใช้งาน) 
  const scrollRef = useRef(); //สร้างตัวแปร scrollRef useRef เพื่อหาค่าปัจจุบัน
  
  const msguse = msg.text;
  const [changebtn, setchangebtn] = useState(msguse)
  
  const btn = (
    <del>
      {msg.text}
    </del>
  );

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" }); //คำสั่งแบบเรียลไทม์ว่ามีข้อความเพิ่มเข้ามาไหมและจะเลื่อนลงโดยลักษณะการเลื่อนจะไหลลื่น(smooth)
  }, [msg]);//current เพื่อใช้หาค่าปัจจุบันของข้อความ โดยใช้คำสั่ง svroolIntoView
  // === ใช้ในการเปรียบเทียบความเหมือนกัน/เป็นอย่างเดียวกัน (identically) //ใช้อ้างอิงเพื่อหาค่าscrollRef

  return (
    <div
      className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
      ref={scrollRef} // เปรียบหาค่าว่านี่เป็นข้อความของผู้ใช้งานหรือเปล่า ถ้าใช่ให้ขึ้นown ถ้าไม่ก็จะว่างเปล่า 
    >
      
      <button className={msg.from === user1 ? "btnright" : "btnleft"} onClick={()=>{setchangebtn(btn)}} > del </button>

      <p className={msg.from === user1 ? "me" : "friend"}  //เปรียบหาค่าว่านี่เป็นข้อความของผู้ใช้งานหรือเปล่า ถ้าใช่ให้ขึ้นmeถ้าไม่ก็จะเป็นfriend 
      /*/เช็คเป็นรูปภาพหรือเปล่า ถ้าใช่จะทำการแทรกรูปภาพและมีข้อความกำกับ ถ้าไม่ใช่ก็เป็นค่าnull ส่วนข้อความจะแสดง/*/
      > 
        {msg.media ? <img src={msg.media} alt={msg.text} /*ตัวแสดงรูปที่เราส่งรูปไปให้กับคนที่สนทนา*//> : null}

        {changebtn}
        
        <br/>
        <small //จะดึงคำสั่ง react-moment เพื่อแสดงเวลาวันที่กำกับข้อความที่ส่งมา 
        >
        <Moment format='Do MMMM YYYY HH:mm' fromDate>{msg.createdAt.toDate().toString()}</Moment> 
        </small> 
      </p> 
    </div>
  );
};

export default Message;
