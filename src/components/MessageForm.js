import React from "react";
import Attachment from "./svg/Attachment";
import '../CSS/Message.css';

const MessageForm = ({ handleSubmit, text, setText, setImg }) => { //เรียกใช้ตัวแปรจากCPN Home มาใช้ใน messagefrom ได้แก่ handleSubmit, text, setText, setImg
  return (
    <form className="message_form" onSubmit={handleSubmit} //ใช้กำหนดให้ function ทำงานเมื่อ form ถูก submit
    > 
      <label htmlFor="img" title ="คลิ้ก เพื่อส่งรูปภาพของคุณ (เมื่ออัปโหลดแล้วให้กดปุ่มส่งข้อความด้วย)">
        <Attachment //จะดึงข้อมูลจาก CPN Attachment เพื่อเอาภาพมาใช้แสดงข้อมูล
        /> 
      </label>
      <input
        onChange={(e) => setImg(e.target.files[0])} //รับข้อมูลไฟล์รูปภาพ
        type="file" //ข้อมูลประเภทfile
        id="img" //ไอดีจะเป็น img
        accept="image/*" //จะเลือกรับข้อมูลที่เป็นรูปภาพ
        style={{ display: "none" }} //เมื่อเลือกรูปภาพ จะไม่มีการแสดงรูปภาพให้เห็น
      />
      <div>
        <input
          type="text" //ข้อมูลประเภทtext
          placeholder="พิมพ์ข้อความของคุณที่นี้" //จะมีข้อความว่า "พิมพ์ข้อความของคุณที่นี้" แสดงในช่องพิมพ์
          value={text} //กำหนดค่าเป็นtext
          onChange={(e) => setText(e.target.value)} //รับข้อความที่ผู้ใช้กำลังพิมพ์
        />
      </div>
      <div //ปุ่มส่งข้อความ
      >
        <button className="btnsend" title="กดปุ่มเพื่อส่งข้อความของคุณ">ส่งข้อความ</button>
      </div>
    </form>
  );
};

export default MessageForm;
