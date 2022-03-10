import React, { useState, useEffect } from "react";/*นำเข้าตัวติดตั้งReact และ module useState, useEffect  จาก react*/
import Camera from "../components/svg/Camera";/*นำเข้า Camera จาก components/svg/Camera */
import Img from "../Images/profile.png"; /*นำเข้า รูป จาก /image1.jpg */
import { storage, db, auth } from "../firebase";/*นำเข้า storage datebase auth  จาก บริการเว็บเซิร์ฟเวอร์  firebase*/
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";/*นำเข้า reference,getDownloadURL,uploadBytes,deleteObject,  จาก firebase/storage */
import { getDoc, doc, updateDoc } from "firebase/firestore"; /*นำเข้า getDoc, doc, updateDoc จาก บริการของ Firebase firebase/firestore   Firestore คือหนึ่งในบริการของ Firebase ช่วยจัดการเกี่ยวกับ Database โดยมีการเก็บโครงสร้างข้อมูลแบบ Document Database */
import Delete from "../components/svg/Delete";/*นำเข้า Delete จาก components/svg/Delete */
import { useHistory } from "react-router-dom";/*นำเข้า useHistory จาก /react-router-dom ใช้ในการทำให้ app ของเราสามารถมีเพจได้หลายหน้า โดยผู้ใช้จะสามารถเลือกคำสั่งหรือกดปุ่มที่ข้อความนี้แล้วให้เปลี่ยนไปในหน้าเพจอีกหน้าตามที่เราต้องการได้*/
import Moment from 'react-moment'/*นำเข้า momet ใช้สำหรับจัดการ Date & Time จาก react-moment */
import "../CSS/Profile.css";/*นำเข้า Profile.css*/

const Profile = () => {
  const [img, setImg] = useState(""); /*การสร้างตัวแปรของ img โดยใช้ useState โดยที่ค่า defalut ของ img เป็น null */
  const [user, setUser] = useState(); /*การสร้างตัวแปรของ user โดยใช้ useState โดยที่ค่า defalut ของ user เป็น null */
  const history = useHistory(""); //คำสั่งเข้าถึงฟังก์ชันต่างๆเพื่อนำทางไปยังหน้าเว็ปอื่นๆได้ แต่มีการกำหนดเงื่อนไขในการเข้าถึงหน้าเว็ปนั้นๆ

  useEffect(() => { 
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {// รับมาค่ามา จาก datebase  user collection ของ user userปัจจุบันเข้ามา แล้ว รับข้อมูลมา
      if (docSnap.exists) {  // รับข้อมูลที่มีอยู่
        setUser(docSnap.data()); // ให้ข้อมุลที่อยู่ ใน docSnap ไปไว้ใน ฟังชัน setUser
      }
    });

    if (img) { 
      const uploadImg = async () => {  //ประกาศฟังชัน  uploadImg  = async
        const imgRef = ref( //ประกาศ imgRef = อ้างอิงรูปภาพมาจาก Storage  และ  collection avatar  วันที่อัพรูปลง และ ชื่อรูปภาพ
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {//คำสั่งในการจัดการและตรวจสอบกับข้อผิดพลาด
          if (user.avatarPath) { // userที่ login 
            await deleteObject(ref(storage, user.avatarPath));  //ลบรูป ภาพ โดย อิง มาจาก storage, userที่login 
          }
          const snap = await uploadBytes(imgRef, img);// ประกาศ snap ใช้ อัพโหลดรูปขึ้น ใน imgRef,img
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath)); //ประกาศ  url โดยจะสร้าง  Url ที่อยู่ โดยอ้างอิง ใน storage, snap.ref.ชื่อเต็ม

          await updateDoc(doc(db, "users", auth.currentUser.uid), { // อัพเดตข้อมูล ในdatebase user collection ของ user ที่logingเข้ามา ดึงข้อมูล avatar: url, avatarPath: snap.ref.fullPath,
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });

        setImg(""); //กำหนด ค่า เป็น null
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg(); //เรียก ฟังชั้น ที่สร้างขึ้นมา
    }
  }, [img]);

  const deleteImage = async () => { //ประกาศฟังชั้น deleteImage = async
    try {//คำสั่งในการจัดการและตรวจสอบกับข้อผิดพลาด
      const confirm = window.confirm("ต้องการลบรูปโปรไฟล์ของคุณไหม?");// ประกาศ confrim  เท่ากับ หน้าต่าง confirm
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath)); // ถ้า confrim ให้ ลบ รูป ที่อยู่ใน storage  userที่login 

        await updateDoc(doc(db, "users", auth.currentUser.uid), { //และอัพเดตข้อ ใน  userที่login 
          avatar: "",// ให้เป็นค่า  null
          avatarPath: "",
        });
        history.replace("/"); //กลับไปหน้าโดยทับค่าเก่า ไม่ใช้ค่าเดิม
      }
    } catch (err) { //หาก  error 
      console.log(err.message); //ให้แสดงข้อความ   err.message
    }
  };
  return user ? (
    <section>
      <div className="profile_container"> 
        <div className="img_container">
          <img src={user.avatar || Img} alt="avatar" /*ให้แสดงรูปภาพ จาก User ในavatar  รูปdefalt และ คำอธิายรูปคือ Avatar*//>
          <div className="overlay">
            <div >
              <label htmlFor="photo" title="อัปโหลดรูปโปรไฟล์ของคุณ"/*กำหนดป้ายชื่อแท็กเป็น "อัปโหลดรูปโปรไฟล์ของคุณ"*/>
                <Camera /> 
              </label>
              <label title="ลบรูปโปรไฟล์ของคุณ" /* กำหนดป้ายชื่อแท็กเป็น "ลบรูปโปรไฟล์ของคุณ" */ > 
              {user.avatar ? <Delete deleteImage={deleteImage} /> : null/* user avartar ถ้า  ลบรูปภาพ  เป็น ค่า null */}
              </label>
              <input
                type="file" /* ประเภท เป็น ไฟล์*/
                accept="image/*"/*ให้แสดงไฟล์ที่เป็นรูปภาพทุกชนิด */
                style={{ display: "none" /*ไม่แสดง ปุ่มรูปภาพ ของhtml */}} 
                id="photo"//การกำหนด ให้เป็นรูป
                onChange={(e) => setImg(e.target.files[0])}/*รับข้อมูลไฟล์รูปภาพ*/ 
              />
            </div>
          </div>
        </div>
        <div className="text_container">
          <h2>{user.name/*แสดง ชื่อ ของ  user */}</h2>
          <p>{user.email/*แสดง ชื่อ ของ  email */}</p>
          <hr />
          <small> เข้าร่วมเมื่อ : <Moment format='Do MMMM YYYY'>{user.createdAt.toDate().toString()}</Moment>
          </small>
        </div>
      </div>
    </section>
  ) : null;
};

export default Profile;
