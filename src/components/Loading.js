import React from "react"; //คือการ Import module จะมีทั้ง import default และ import module

const Loading = () => { //ประกาศตัวแปร loading
  return ( //Position Relative คือ Attribute ในการจัดตำแหน่งของ CSS โดยมีคุณสมบัติคือ จะทำการจัดตำแหน่งโดยอิงจาก DIV ที่ห่อหุ้มตัวมันอยู่
    <div style={{ position: "relative" }}>
      <h2
        style={{ //ใช้รวมกับคำสั่ง left, right, top, bottom สำหรับการเคลื่อนตำแหน่งไปในทิศทางต่าง ๆ
          /*Attribute "style" นั้นเป็น HTML attribute ใหม่ที่ช่วยในการกำหนด CSS Style เข้าไปใน HTML element ต่าง ๆ 
          ซึ่งเราจะเรียกการกำหนด CSS Style ใน HTML element ว่าการกำหนดแบบ inline*/
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", //transform คือ การที่จะใส่เอฟเฟ็กต่างๆให้แก่ element
        }} //translate() - การย้าย element ไปตำแหน่งที่กำหนด
      >
        กรุณารอสักครู่....
      </h2>
    </div>
  );
};

export default Loading; //คือการ export ตัว Component loading เพื่อเอาไปใช้ที่ไฟล์อื่น
//React เป็น JavaScript Library ที่เอาไว้สำหรับทำ UI
