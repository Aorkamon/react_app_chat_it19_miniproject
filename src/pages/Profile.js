import React, { useState, useEffect } from "react";
import Camera from "../components/svg/Camera";
import Img from "../Images/profile.png";
import { storage, db, auth } from "../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import Delete from "../components/svg/Delete";
import { useHistory } from "react-router-dom";
import Moment from 'react-moment'
import "../CSS/Profile.css";

const Profile = () => {
  const [img, setImg] = useState("");
  const [user, setUser] = useState();
  const history = useHistory("");

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });

    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });

          setImg("");
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg();
    }
  }, [img]);

  const deleteImage = async () => {
    try {
      const confirm = window.confirm("ต้องการลบรูปโปรไฟล์ของคุณไหม?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));

        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
        history.replace("/");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return user ? (
    <section>
      <div className="profile_container">
        <div className="img_container">
          <img src={user.avatar || Img} alt="avatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo" title="อัปโหลดรูปโปรไฟล์ของคุณ">
                <Camera />
              </label>
              <label title="ลบรูปโปรไฟล์ของคุณ" >
              {user.avatar ? <Delete deleteImage={deleteImage} /> : null}
              </label>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="text_container">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <hr />
          <small> เข้าร่วมเมื่อ : <Moment format='Do MMMM YYYY'>{user.createdAt.toDate().toString()}</Moment>
          </small>
        </div>
      </div>
    </section>
  ) : null;
};

export default Profile;
