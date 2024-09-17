import React, {useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SideNav from "./SideNav";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import {BsEmojiSmileFill} from "react-icons/bs";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { setPosts } from "../utils/APIRoutes";
import img from "../assets/amongus.jpg";


function Compose() {

    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [post, setPost] = useState("");
    const quillRef = useRef(null);

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };
    // const handleEmojiClick = (event,emoji) => {
    //     let Post = post;
    //     Post += emoji.emoji;
    //     setPost(Post);
    // };
    
    const handleEmojiClick = (event, emoji) => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            const selection = editor.getSelection();
            const cursorPosition = selection ? selection.index : 0;
            
            let nextChar = editor.getText(cursorPosition + 1, 1);
            if (nextChar && !nextChar.match(/\s/)) {
                // If there's a character immediately after the cursor and it's not whitespace, find the end of the current word
                let endOfWord = cursorPosition + 1;
                while (endOfWord < editor.getLength() && !editor.getText(endOfWord, 1).match(/\s/)) {
                    endOfWord++;
                }
                editor.insertText(endOfWord, emoji.emoji);
                editor.setSelection(endOfWord + emoji.emoji.length, 0);
            } else {
                editor.insertText(cursorPosition, emoji.emoji);
                editor.setSelection(cursorPosition + emoji.emoji.length, 0);
            }
        }
    };
    
    
    useEffect( () => {
        async function fetchCurrentUser() {
            if(!localStorage.getItem("chat-app-user")){
                navigate("/login");
            } else {
                setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
                
            }
            if(currentUser){
                console.log(currentUser._id);
            }   
            
        };
        fetchCurrentUser();
    },[]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!post.trim()){
            alert("Please write the content");
            return;
        }
        try {
            const response = await axios.post(`${setPosts}/${currentUser._id}`, {
                content:post,
                avatarImage: currentUser.avatarImage,
                username: currentUser.username,
            });
            if(response.status === 200) {
                navigate('/');
            } else {
                throw new Error('Failed to submit post');
            }
        } catch (error) {
            console.log('Error submitting post:', error.message);
        }
    };

    
    return (
        <>
            <Container>
                <div className="container">
                        <SideNav currentUser={currentUser}></SideNav>
                    <div className="compose-container">
                        <div className="slogan-container">
                            <img src = {img}></img>
                            <p>"Don't hold back your thoughts; release them freely, anonymously, to the world!"</p>
                        </div>
                        <div className="form-container">
                            <div className="button-container" >
                                <div className="emoji">
                                    <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}/>
                                    {showEmojiPicker && <Picker height={250} width={250} onEmojiClick={(emoji,event) => handleEmojiClick(event,emoji) } theme="dark" size={10} native={true} previewConfig={{showPreview: false }}   />}
                                </div>
                            </div>     
                            <form  onSubmit={handleSubmit}>
                                <ReactQuillContainer>
                                    <ReactQuill
                                        ref={quillRef}
                                        theme="snow"
                                        value={post}
                                        onChange={setPost}
                                        placeholder="What's your thought?"
                                        className="react-quill"
                                    />
                                </ReactQuillContainer>
                                <button type="submit" className="submit-btn" >
                                    <IoMdSend />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}



const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;

    .container {
        height: 100vh;
        width: 100vw;
        background-color: #131324;
        display: grid;
        grid-template-columns: 20% 75%;
        
        @media screen and (max-width: 1080px) {
            grid-template-columns: 30% 70%;
        }

        @media screen and (max-width: 768px) {
            grid-template-columns: 30% 70%;
        }
    }

    .compose-container {
        display: grid;
        grid-template-rows: 60% 40%;
        align-items: center;

        @media screen and (max-width: 768px) {
            grid-template-rows: 60% 40%;
        }
    }
    form{
        width: 100%;
        display: flex;
        background-color:#080420;
        align-items: flex-end;
        .submit-btn{
            display: flex;
            align-items: center;
            justify-content: center;
            height:1.5rem;
            margin-bottom:10px;
            width:2.5rem;
            color:#131324;
            font-size: 1rem;
            cursor: pointer;
            }
    }
    .form-container {
        display: flex;
        align-items: center;
        padding: 15px;
        height: 100%;
    }
    .slogan-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        text-align: center; 
        p{
            padding-right:2rem;
            padding-left:2rem;
            font-size: 1.25rem;
            color: white;
            margin: 0;
            line-height: 1.5;
        }
        img{
            height: 8.5rem;
            border-radius:30%;
        }
        @media screen and (max-width: 950px) {
            display: flex;
            align-items: center;
            justify-content: center;
            p{
                font-size: 1.1rem;
                color: white;
            }
        }
        
    }
    .button-container {
        display: flex;
        align-items: center;
        color: white;
        gap: 0.5rem;

        .emoji {
            position: relative;
            padding-right: 10px;
            padding-left: 7px;
            

            svg {
                font-size: 1.5rem;
                color: #ffff00c8;
                cursor: pointer;
            }
        }
        .EmojiPickerReact {
            --epr-emoji-size: 20px; /* Adjust the size of emojis */
            --epr-emoji-gap: 5px;
            
            .epr-search-container{
                input{ 
                    height: 30px;
                }
            }
            .epr-category-nav{
                padding:0;
                padding-bottom: 5px;
                size: 20px;
               
            }
            .emoji-scroll-wrapper::-webkit-scrollbar{
                background-color:#080420;
                width: 5px;
                &-thumb {
                    background-color:#9186f3;
                }
            }
        }
    }
 
`;

const ReactQuillContainer = styled.div`
    width: 90%;
    background-color: #080420;

    .react-quill {
        width: 100%;
        height: 100%;
        padding: 15px;
        padding-bottom: 10px;
        background-color: transparent;
        color: white;
        border: none;
        font-size: 1.2rem;

        @media screen and (max-width: 768px) {
            height: 100%;
        }

        .ql-container {
            height: 160px;
        }

        &:focus {
            outline: none;
        }

        .ql-editor::before {
            color: white;
        }

        &::selection {
            background-color: #9186f3;
        }

        overflow: auto;

        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
    }
`;


export default Compose;