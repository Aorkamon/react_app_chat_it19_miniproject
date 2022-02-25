import React, {useEffect, useState}from 'react';
import {db, auth, storage} from '../firebase'
import {collection, 
        query, 
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
import Logo from '../LogoChat.png'
import './Home.css'

const Home = () => {
  const [users, setUsers] = useState([])
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);

  const user1 = auth.currentUser.uid

  useEffect(() => {
    const userRef = collection(db, "users");
    // create query object 
    const q = query(userRef, where("uid", "not-in", [user1]))
    // excute query object //
    const unsub = onSnapshot(q, querySnapshot => {
      let users= []
      querySnapshot.forEach(doc=> {
        users.push(doc.data())
      })
      setUsers(users);
    })
    return () => unsub();
  }, []);

  const selectUser = async (user) => {
    setChat(user)

    const user2 = user.uid
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, 'messages', id, 'chat');
    const q = query(msgsRef, orderBy('createdAt', 'asc'))

    onSnapshot(q, querySnapshot => {
      let msgs = []
      querySnapshot.forEach(doc => {
        msgs.push(doc.data())
      })
      setMsgs(msgs)
    })

    // get last message betwwn loggin user and select users
    const docSnap = await getDoc(doc(db, 'lastMsg', id))
    // if last message exists and message is from select user
    if(docSnap.data() && docSnap.data().from !== user1){
      // update last message doc, set unread = false
      await updateDoc(doc(db, 'lastMsg', id), {unread: false})
    }
  }

  console.log(msgs)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user2 = chat.uid
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;


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
    setText("");
    setImg(null);
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