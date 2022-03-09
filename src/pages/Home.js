import React, {useEffect, useState}from 'react';
import {db, auth, storage} from '../firebase'
import {collection, //คำสั่ง collecetion เป็นคำสั่งเข้าถึงต้วคอเลกชั่นหรือโฟลเดอร์ที่มีการเก็บข้อมูลหลายๆตัวไว้ในนั้น
        query, //คำสั่ง query เป็นคำสั่งที่ไว้ใช้ในการสร้างแบบสอบถาม คล้ายๆกับภาษา SQL มักใช้ร่วมกับ where
        where, 
        onSnapshot, 
        addDoc, 
        Timestamp, 
        orderBy, 
        setDoc, 
        doc, 
        getDoc, 
        updateDoc} from 'firebase/firestore'
import User from '../components/User'
import MessageForm from '../components/MessageForm';
import {ref, getDownloadURL, uploadBytes} from 'firebase/storage'
import Message from '../components/Message';
import Logo from '../Images/LogoChat.png'
import '../CSS/Home.css'

const Home = () => {
  const [users, setUsers] = useState([])
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);

  const user1 = auth.currentUser.uid //คำสั่งในการกำหนดให้ตัวแปร user1 คือผู้ที่เข้าใช้งานอยู่ในปัจจุบันตอนนี้
  //auth มาจากข้อมูลของบัญชีการเข้าในงาน, currentUser คือตัวuserที่กำลังเข้าใช้งานอยู๋ในปัจจุบันตอนนี้, uid คือตัวที่จะใช้ในการอ้างอิงเงื่อนไขต่างๆ

useEffect(() => {

    //รูปแบบคำสั่งในการดักฟังเอกสารหลายชุดในคอลเล็กชั่น---
    const userRef = collection(db, "users"); //เรียกใช้ข้อมูลจากคอเล็กชั่นที่มีชื่อว่า users
    const q = query(userRef, where("uid", "not-in", [user1]));
    //ตัวแปร q ที่มีการทำ query โดยนำข้อมูลจากคอเล็กชั่น user มาเปรีบเทียบเงื่อนไข uid ของuser ไม่เท่ากับ ตัวแปร user1

    const unsub = onSnapshot(q, querySnapshot => {
      let users= []//*** 
      querySnapshot.forEach(doc=> {
        users.push(doc.data())//**** 
      })
      setUsers(users);//ให้ฟังก์ชั่นเซตค่าของ users หลังจากทำการ **** แล้ว
    })
    //-----------------------------------------------

    return () => unsub();
  }, []);

  const selectUser = async (user) => {//คำสั่งที่ใช้ในการเลือกผู้ที่ต้องการสนทนาด้วย
    setChat(user)//ให้เซตข้อมูลของฟังก์ชั่น setChat ตามข้อมูลของ user

    const user2 = user.uid //ตัวแปร user2 กำหนดให้ตัวเป็นการอ้างอิงถึง uid ของ user นั้น
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    //คำสั่งในการโหลกข้อความแต่ละข้อความ ถ้าหากข้อความของตัว User 1 มากกว่าตัว User 2 ให้ทำการแสดงข้อมูลที่สนทนากันของ User1 และ User 2

    const msgsRef = collection(db, 'messages', id, 'chat');
    const q = query(msgsRef, orderBy('createdAt', 'asc'))//สร้างแบบสอบถาม และกำหนดให้มีการเรียงลำดับข้อมูลแชทการสนทนา เรียงจากน้อยไปมาก

    onSnapshot(q, querySnapshot => {
      let msgs = []
      querySnapshot.forEach(doc => {
        msgs.push(doc.data())
      })
      setMsgs(msgs);
    })

    //รับข้อความล่าสุดที่มีการสนทนากัน
    const docSnap = await getDoc(doc(db, 'lastMsg', id))
    //ถ้าข้อความล่าสุดนั้นมีอยู่ในคอเล็กชั่น และข้อความนั้นไม่ได้มากจากผู้ใช้ที่กำลังเข้าใช้ระบบอยู่ หรือ ข้อความนั้นต้องมากจากผู้ส่ง ที่อยู่ฝั่งซ้ายมือ
    if(docSnap.data() && docSnap.data().from !== user1){
      //ถ้าใช่ ให้ทำการอัปเดตข้อมูลข้อความล่าสุด ในคอเล็กชั่นlastMsg และเซตค่า unread ให้เป็น false
      await updateDoc(doc(db, 'lastMsg', id), {unread: false})
    }
  }
  //console.log(msgs)

  const handleSubmit = async (e) => { //คำสั่งเมื่อมีการกดปุ่ม Enter หรือปุ่มส่งข้อความ
    e.preventDefault();//คำสั่งป้องกันไม่ให้ตัว Browser มีการ Reload หรือ refesh ถ้าไม่ใส่คำสั่งนี้ เมื้อกดปุ่มยันยันแล้ว Browser จะมีการ refesh หน้าตัวเอง

    const user2 = chat.uid
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`; 
    //เครื่องหมาย $ นี้หมายถึง ตัวที่เอาไว้เชื่อกับข้อความธรรมดา เช่น 
    //console.log(`Fifteen is ${a + b} and
    //not ${2 * a + b}.`);
    // "Fifteen is 15 and
    // not 20."

    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }

    await addDoc(collection(db, "messages", id, "chat"), { 
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    })

    await setDoc(doc(db, 'lastMsg', id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    })

    //เมื่อมีการส่งข้อความไปแล้ว ให้ทำการเคลียค่าออก ทั้งข้อความและรูปภาพ
    setText("");
    setImg(null);
    //--------------------------------------------------------
  }
  return (
    <div className="home_container">
      <div className="users_container">
        {users.map(user => 
        <User key={user.uid} user={user} selectUser={selectUser} user1={user1} chat={chat}/>
        )}
      </div>
      <div className="messages_container">
          {chat ? (
            <>
          <div className="messages_user">
            <h3 className="title_message">{chat.name}</h3>
            <h3>{auth.currentUser.uid}  {chat.uid}</h3>
          </div> 
          <div className="messages">
            {msgs.length ? msgs.map((msg, i) => 
            <Message key={i} msg={msg} user1={user1} />) : null}
          </div>
          <MessageForm
            handleSubmit={handleSubmit} 
            text={text} 
            setText={setText}
            setImg={setImg}
            />
            </>
          ): 
          (<div>
          <h3 className="no_conv">เริ่มต้นการสนทนาของคุณได้เลย</h3>
            <img src={Logo} className="logoChat"></img>
            </div>
          )}
      </div>
    </div>
    );
}

export default Home