import React, {useEffect, useState}from 'react';
import {db, auth, storage} from '../firebase'
import {collection, //คำสั่ง collecetion เป็นคำสั่งเข้าถึงต้วคอเลกชั่นหรือโฟลเดอร์ที่มีการเก็บข้อมูลหลายๆตัวไว้ในนั้น
        query, //คำสั่ง query เป็นคำสั่งที่ไว้ใช้ในการสร้างแบบสอบถาม คล้ายๆกับภาษา SQL มักใช้ร่วมกับ where
        where, 
        onSnapshot, //การดักฟังเอกสาร
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
    const userRef = collection(db, "users"); //อ้างอิงและเรียกใช้ข้อมูลจากคอเล็กชั่นที่มีชื่อว่า users
    const q = query(userRef, where("uid", "not-in", [user1]));
    //ตัวแปร q ที่มีการทำ query โดยนำข้อมูลจากคอเล็กชั่น user มาเปรีบเทียบเงื่อนไข uid ของuser ไม่เท่ากับ ตัวแปร user1

    const unsub = onSnapshot(q, querySnapshot => { //คำสั่งในการอ่านค่า เพื่อหาชื่อผู้ใช้ที่ต้องการจะสนทนาของแต่ละคนออกมา
      let users= []//กำหนดตัวแปรให้อยู่ในรูปแบบของ Arrey
      querySnapshot.forEach(doc=> { //
        users.push(doc.data()) //เมื่อมันหาครบทุกตัวแล้ว มันก็จะทำการส่งข้อมูลออกไป ให้ตรงตามเงื่อนไขของตัว query
      })
      setUsers(users);//ให้ฟังก์ชั่นเซตค่าของ users หลังจากทำการ **** แล้ว
    })
    //-----------------------------------------------

    return () => unsub();
  }, []);

  const selectUser = async (user) => {//คำสั่งที่ใช้ในการเลือกผู้ที่ต้องการสนทนาด้วย
    setChat(user)//ให้เซตข้อมูลของฟังก์ชั่น setChat ตามข้อมูลของ user

    const user2 = user.uid //ตัวแปร user2 กำหนดให้ตัวเป็นการอ้างอิงถึง uid ของ user นั้น
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;//เราสามารถอ้างถึงตัวแปรที่อยู่ใน scope เราทั้งหมดได้โดยการใช้ ${ชื่อตัวแปร}
    //คำสั่งในการโหลกข้อความแต่ละข้อความ ถ้าหากข้อความของตัว User 1 มากกว่าตัว User 2 ให้ทำการแสดงข้อมูลที่สนทนากันของ User1 และ User 2

    const msgsRef = collection(db, 'messages', id, 'chat');
    const q = query(msgsRef, orderBy('createdAt', 'asc'))//สร้างแบบสอบถาม และกำหนดให้มีการเรียงลำดับข้อมูลแชทการสนทนา เรียงจากน้อยไปมาก

    onSnapshot(q, querySnapshot => {
      let msgs = [] //ประกาศตัวแปรประเภท let เพื่อใช้ทำคำสั่งในแค่เครื่องหมายนั้น
      querySnapshot.forEach(doc => {// for Eachใช้เพื่อเข้าถึงข้อมูลใน Array ต่างๆ โดยที่เราไม่ต้องประกาศค่า index ในการวนลูปเอง แต่ forEach จะเข้าถึงข้อมูลใน Array ตั้งแต่ตำแหน่งแรกจนถึงสุดท้ายให้เรา
        msgs.push(doc.data())//เมื่อมันหาครบทุกตัวแล้ว มันก็จะทำการส่งข้อมูลออกไป ให้ตรงตามเงื่อนไขของตัว query
      })
      setMsgs(msgs); 
    })

    //รับข้อความล่าสุดที่มีการสนทนากัน
    const docSnap = await getDoc(doc(db, 'lastMsg', id))//รับข้อมูลมาจากคอเล็กชั่น lastMsg
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
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`; //เราสามารถอ้างถึงตัวแปรที่อยู่ใน scope เราทั้งหมดได้โดยการใช้ ${ชื่อตัวแปร}
    //คำสั่งในการโหลกข้อความแต่ละข้อความ ถ้าหากข้อความของตัว User 1 มากกว่าตัว User 2 ให้ทำการแสดงข้อมูลที่สนทนากันของ User1 และ User 2
    //เครื่องหมาย $ นี้หมายถึง ตัวที่เอาไว้เชื่อกับข้อความธรรมดา เช่น 
    //console.log(`Fifteen is ${a + b} and
    //not ${2 * a + b}.`);
    // "Fifteen is 15 and
    // not 20."

    let url;
    if (img) {//ในกรณีที่มีรูปภาพ ก็จะมีการเช็คเงื่อนไขว่าว่ามีรูปไหม
      const imgRef = ref( 
        storage,// สร้างตัวแปรเื่อใช้ในการอ้างอิง โดยเข้าถึงไปยังตัว storage / คอเล็กขั่น images / และให้บันทึกเวลาที่มีการสร้างไฟล์นี้ลงในตัว cloud
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img); //ฟังก์ชั่นในการอัปโหลดไฟล์ขึ้นไปบน Cloud
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath)); 
      //ทำการโหลดข้อมูล URL โดยอ้างอิงมาจาก Storage และ ตัวPath ของรูปภาพแบบเต็ม //คำสั่งเพื่อใช้ในการอ้างอิงว่า คนนี้ส่งรูปให้ใคร
      //มันจะทำการรับค่า การดาวโหลด URL มา เพื่อนำไปใช้ในการอ้างการเก็บข้อมูลแชทของแต่ละ User
      url = dlUrl;
      //console.log(url);
    }

    await addDoc(collection(db, "messages", id, "chat"), {  //คำสั่งในการสร้างข้อมูลแชทเก็บไว้ใน cloud
      // เข้าไปเพิ่มข้อมูลในคอเล็กชั่น message / และในคอเล็กชั่น message ก็มำการสร้างคอเล็กชั่น chat ขึ้นมาอีก เพื่อเก็บข้อมูลแชทของแต่ละ user
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",//url นี้มันก็จะเก็บ path ไว้ด้วย
    })

    await setDoc(doc(db, 'lastMsg', id), { //เซตข้อมูลให้อยู่ในคอเล็กชั่น lastmsg 
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
        //สำหรับ Method Map นั้นจะคล้ายกับ ForEach เลย คือค่าใน Array แต่ละตัวจะทำการนำไปผ่าน Function 
        //ที่เรากำหนดไว้ แต่ Map นั้น สามารถ return ค่าออกมาได้โดยค่าที่ return ออกมาจะเป็น Array ซึ่งสามารถนำไปทำใน Method อื่นได้
        <User key={user.uid} user={user} selectUser={selectUser} user1={user1} chat={chat}/>
        //ดึงข้อมูลมาจาก components User และสร้างตัวแปรเพื่อนำมาใช้ในการแสดงผล และอ้างอิงต่างๆ
        )}
      </div>
      <div className="messages_container">
          {chat ? ( // คำสั่งในการแสดงข้อมูลถ้าเป็นค่า null ให้ขึ้นแสดงหน้าเริ้มต้นการสนทนา แต่ถ้ามีให้ทำการเข้าแสดงข้อมูลของแชทที่สนทนา
            <>
          <div className="messages_user">
            <h3 className="title_message">{chat.name}</h3>
          </div> 
          <div className="messages" /*อยู่ในส่วนของ Message form*/>
            {msgs.length ? msgs.map((msg, i) => 
            /*เป็นคำสั่งที่มีการส่งค่าที่เป็นข้อความ ส่งต่อไป Message เพื่แทำการแสดงข้อคววามออกมา // ฟังก์ชั่นสำหรับนับจำนวน เช่น นับจำนวน Array หรือนับจำนวนตัวอักษรจากข้อความ*/ 
            <Message key={i} msg={msg} user1={user1} /*numbers.map(function (value, index)*/ />) : null}

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
/*<h3>{auth.currentUser.uid}  {chat.uid}</h3>*/
// === ใช้ในการเปรียบเทียบความเหมือนกัน/เป็นอย่างเดียวกัน (identically)