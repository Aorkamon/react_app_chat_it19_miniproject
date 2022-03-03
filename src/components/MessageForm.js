import React from "react";
import Attachment from "./svg/Attachment";
import '../CSS/Message.css';

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
  return (
    <form className="message_form" onSubmit={handleSubmit}>
      <label htmlFor="img" title ="คลิ้ก เพื่อส่งรูปภาพของคุณ (เมื่ออัปโหลดแล้วให้กดปุ่มส่งข้อความด้วย)">
        <Attachment />
      </label>
      <input
        onChange={(e) => setImg(e.target.files[0])}
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none" }}
      />
      <div>
        <input
          type="text"
          placeholder="พิมพ์ข้อความของคุณที่นี้"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button className="btnsend" title="กดปุ่มเพื่อส่งข้อความของคุณ">ส่งข้อความ</button>
      </div>
    </form>
  );
};

export default MessageForm;
