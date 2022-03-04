import React, { useRef, useEffect } from "react";
import Moment from "react-moment";
import '../CSS/Message.css';
import 'moment/locale/th';

const Message = ({ msg, user1 }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
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
