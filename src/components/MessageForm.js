import React from "react";
import Attachment from "./svg/Attachment";
import './Message.css';

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
  return (
    <form className="message_form" onSubmit={handleSubmit}>
      <label htmlFor="img">
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
        <button className="btnsend">ส่งข้อความ</button>
      </div>
    </form>
  );
};

export default MessageForm;
