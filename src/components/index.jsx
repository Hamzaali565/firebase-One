import React from "react";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, addDoc,
    getDocs, doc, onSnapshot, query,
    serverTimestamp, orderBy, deleteDoc, updateDoc

} from "firebase/firestore";
import "./index.css"
import moment from "moment/moment";
import { async } from "@firebase/util";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyDX7Ae0-a6QkvKqO2jNcrUv98_gL3u5QUU",
    authDomain: "firewheelings.firebaseapp.com",
    projectId: "firewheelings",
    storageBucket: "firewheelings.appspot.com",
    messagingSenderId: "942284991077",
    appId: "1:942284991077:web:ee5007421d8548e284f48c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const Combo = () => {
    const [postText, setPostText] = useState("");
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [isEditingText, setIsEditingText] = useState("")

    useEffect(() => {
        // const getData = async () => {


        //     const querySnapshot = await getDocs(collection(db, "posts"));

        //     querySnapshot.forEach((doc) => {
        //         console.log(`${doc.id} => `, doc?.data());
        //         // setPosts([...posts, doc.data]) 

        //         setPosts((prev) => {
        //             let newArray = [...prev, doc.data()];
        //             return newArray;
        //         });
        //         console.log("POST", posts);

        //     });
        // }
        // getData();
        let unsubscribe = null;
        const getRealTimeData = async () => {
            const q = query(collection(db, "posts"), orderBy("createdOn", "desc"));
            unsubscribe = onSnapshot(q, (querySnapshot) => {
                const posts = [];
                querySnapshot.forEach((doc) => {
                    // let data = doc.data();
                    // data.id = doc.id;
                    // posts.push(data);
                    posts.push({ ...doc.data(), id: doc.id })
                });
                setPosts(posts);
                console.log("Posts", posts);
            });

        };
        getRealTimeData();

        return () => {
            unsubscribe();
            console.log("cleanUp Function");
        }
    }, [])
    // {console.log(posts)}

    const savePost = async (e) => {
        e.preventDefault();
        console.log('postText', postText);
        try {
            const docRef =
                await addDoc(collection(db, "posts"), {
                    text: postText,
                    createdOn: serverTimestamp(),
                });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };


    const deletepost = async (postId) => {
        await deleteDoc(doc(db, "posts", postId));
        console.log(postId);
    };

    const updatePost = async (e) => {
        e.preventDefault();

        // Set the "capital" field of the city 'DC'
        await updateDoc(doc(db, "posts", isEditing), {
            text: isEditingText
        });
        setIsEditing(null);
        setIsEditingText("");

    };
    // const Edit = (postId, text) => {
    //     setIsEditing(postId),
    //     setIsEditingText(text)
    // };

    return (
        <div >
            <h1>Parag. Post</h1>
            <div className="Container">
                <div className="inBut">
                    <form onSubmit={savePost}>
                        <textarea type="text"
                            placeholder=
                            "What is in your mind ..."
                            onChange={(e) => {
                                setPostText(e.target.value)
                            }}

                        />
                        <br />
                        <div className="butt">
                            <button type="submit">Post</button>
                        </div>
                    </form>
                </div>
                <div className="allPosts">

                    {posts.map((eachpost, i) => (
                        <div className="MainPost" key={i}><div className="post">


                            <h3>{(eachpost.id === isEditing)
                                ? <form onSubmit={updatePost}>
                                    <input
                                        type="text"
                                        value={isEditingText}
                                        onChange={(e) => {
                                            setIsEditingText(e.target.value)
                                        }}
                                        placeholder="Write Something"
                                    />
                                    <button type="submit">update</button>
                                </form>
                                : eachpost.text}</h3>


                            <p>{
                                moment(
                                    (eachpost?.createdOn?.seconds) ?
                                        eachpost?.createdOn?.seconds * 1000
                                        :
                                        undefined
                                )
                                    .fromNow()
                                // .format ('Do MMMM, h:mm a ')
                            }</p>
                            <div className="dit">
                                <button onClick={() => {
                                    deletepost(eachpost.id)
                                }}
                                >Delete</button>


                                <button onClick={() => {
                                   setIsEditing(eachpost?.id)
                                   setIsEditingText(eachpost?.text)
                                    // const updatedState =
                                    //     posts.map(eachItems => {
                                    //         if (eachItems.id === eachpost?.id) {
                                    //             return { ...eachItems, isEditing: !eachItems.isEditing }
                                    //         } else {
                                    //             return eachItems
                                    //         }
                                    //     })
                                    // setPosts(updatedState);
                                }}
                                >Edit</button>
                            </div>
                        </div>
                        </div>
                    ))}


                </div>

            </div>
        </div>
    )
}
export default Combo;