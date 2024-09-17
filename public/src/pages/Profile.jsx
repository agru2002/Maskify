import React, {useState, useEffect} from "react";
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import {getUserProfile, userPost, addContact } from "../utils/APIRoutes";
import axios from "axios";
import SideNav from "./SideNav";
import UserPostProfile from "./UserPostProfile";
import {ToastContainer, toast} from "react-toastify";


function Profile () {

    const {userId} = useParams();
    //const timestamp = new URLSearchParams(window.location.search).get('timestamp');
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [posts, setPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [contactCount, setContactCount] = useState(0);
    const [likeCount,setLikeCount] = useState(0);
    const [userAvatarImage, setUserAvatarImage ] = useState(undefined);
    const [username , setUserName] = useState(undefined);
    const [currentUserId , setCurrentUserId] = useState(undefined);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 1500,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    } 

    useEffect( () =>{
        async function fetchCurrentUser() {

            if(!localStorage.getItem("chat-app-user")){
                navigate("/login");
            } else {
                setCurrentUser ( await JSON.parse(localStorage.getItem("chat-app-user")));
                setCurrentUserId( await JSON.parse(localStorage.getItem("chat-app-user"))._id);
                setIsLoaded(true);
            }
        };
        fetchCurrentUser();
    }, []);
    
    useEffect ( () => {
        async function fetchUserProfile() {
            try{
                if(!currentUser) return;
                const res = await axios.get(`${getUserProfile}/${userId}`);
                if(res.status === 200){
                    setUserAvatarImage(res.data.avatarImage);
                    setUserName(res.data.username);
                    setContactCount(res.data.contactCount);  
                }

            } catch(err) {
                console.log(err);
            }
        }
        fetchUserProfile();
        
    },[currentUser,userId]);

    useEffect( () => {
        async function fetchUserPosts(){
            try{
              if(!currentUser) return;
                console.log(currentUser);
                const response = await axios.get(`${userPost}/${userId}`);
                    if(response.status===200)
                        {
                            setPosts(response);
                            setPostCount(response.data.length);
                            let totalLikes = 0;
                            response.data.forEach(post => {
                                totalLikes += post.likes;
                            });
                            console.log(totalLikes);
                            setLikeCount(totalLikes);
                        } 
                
            } catch (error) {
                console.log('Error fetching posts:', error);
            }
        }
          fetchUserPosts();

        
      },[currentUser,userId]);

      const setContact = async(postedBy) => {
            try{
                const response = await axios.post(`${addContact}/${currentUser._id}`,{
                    contact : postedBy,
                }  
                );
                if(response.status===200 && response.data.flag===0){
                
                    toast("Added to friend successfully",toastOptions);
                }
                if(response.status===200 && response.data.flag===1){
                    toast("Friend already exist",toastOptions);
                }
            } catch (error) {
                console.log(error);
            } 
      };


    return (
        <Container>
            <div className="container">
                <SideNav currentUser={currentUser}></SideNav>
                <div className="profile">
                    <header className="profile-header">
                        <div className="user-detail">
                            <div className="user-avatarImage">
                               { userAvatarImage && (
                                <img
                                    src={`data:image/svg+xml;base64,${userAvatarImage}`}
                                    alt="avatar"
                                />
                               )} 
                            </div>
                            <div className="profile-info">
                                <div className="profile-username"> {username}</div>
                                    <div className="info-container">
                                        <div className="post-info">
                                            <span>posts</span>
                                            <div className="count"> {postCount}</div>
                                        </div>
                                        <div className="contact-info">
                                            <span>contacts</span>
                                            <div className="count"> {contactCount}</div>
                                        </div>
                                        <div className="like-info">
                                            <span>upvotes</span>
                                            <div className="count"> {likeCount}</div>
                                        </div>
                                    </div>
                            </div>
                            
                        <button className={`chat-btn ${currentUserId === userId ? 'disabled' : ''}`} onClick={() => setContact(userId)} disabled={currentUserId === userId}>
                            <span>chat</span>
                        </button>
                            
                        </div>
                    </header>
                    <div className = "line">
                        <hr/>
                    </div>
                               
                    
                    {/* <UserPostProfile postss = {posts} /> */}
                    <div className="post-wrapper">
                        <div className="posts-header"> <span>POSTS</span></div>
                        {postCount !== 0  ? (
                            <UserPostProfile postss = {posts} /> 
                        ) : (
                            <div className="empty-post">
                                <span>No Posts to Show</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            <ToastContainer />
        </Container>
    );
}


const Container = styled.div`
    height: 100vh;
    width: 100vw;
    

    .container{
        height: 100vh;
        width: 100vw;
        background-color:#131324 ;
        display: grid;
        grid-template-columns: 20% 80%;
        @media screen and (min-width: 600px) and (max-width: 1080px){
            grid-template-columns: 35% 65%;
         }
        .profile{
            display:grid;
            grid-template-rows:30% 1% 69%;

            header{
                display: flex;
                justify-content: center; 
                align-items: center;

                .user-detail{
                    display: flex;
                    gap: 5.5rem;
                    justify-content: center; 
                    align-items: flex-start;
                    width: 60%;
                
                    .user-avatarImage{
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            img{
                                height: 8.5rem;
                            }
                        }
                    .profile-info{
                        display:flex;
                        flex-direction: column;
                        color: white;
                        gap: 1.75rem;
                        .profile-username{
                        display: flex;
                        ${'' /* justify-content: center; */}
                        align-items: center;
                        color: white;
                        font-size:2rem;
                        padding-top:1rem;
                        }
                        .info-container{
                            display: flex;
                            gap:1.5rem;
                            font-size: 1.2rem;
                            .count{
                                padding-top:0.3rem;
                                display:flex;
                                justify-content:center;
                                align-items: center;
                            }
                        }
                    }
                    
                    .chat-btn{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 2.1rem;
                        width: 4rem;
                        ${'' /* border: 1px solid black; */}
                        margin-top: 0.5rem;
                        color: white;
                        background-color: #222234;
                        margin-left: 15%;
                        border-radius: 0.3rem;
                        cursor:pointer;
                        border:none;
                        font-size:1rem;
                        &:hover{
                            background-color:#403c58;      
                            }
                            span{
                                padding:10px;
                            }
                    }
                    .chat-btn:disabled {
                        opacity: 0.7;
                        cursor: not-allowed;
                    }

                    @media screen and (min-width: 600px) and (max-width: 1080px){
                         grid-template-columns: 35% 65%;
                         width:60% ;
                         gap: 2rem;
                         display:flex;
                         justify-content:center;
                         .user-avatarImage{
                            img{
                                height: 5rem;
                            }
                         }
                        .profile-info{
                            gap: 1rem;
                            .profile-username{
                                font-size:1.3rem;
                            }
                            .info-container{
                                gap:1rem;
                                font-size: 1rem;
                            }
                        }
                        .chat-btn{
                            height: 2rem;
                            width: 3rem;
                            margin-left:0;
                            span{
                                padding:10px;
                            }
                        }
                        
                    }
                }
            }
            .line{
                display: flex;
                justify-content: center;
                align-items: center;
                hr{
                border: none; 
                border-top: 1px solid #ffffff1f;
                width: 75%;
                }
            }  
            .post-wrapper{
                
                .posts-header{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white; 
                    padding-top: 0.7rem;
                    padding-bottom: 0.5rem;
                    font-size: 1.1rem;
                }
                .empty-post{
                    padding-top: 9.5rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white; 
                    font-size: 3rem;
                    
                }
                margin-top: 1rem;
                @media screen and (min-width: 600px) and (max-width: 1080px){
                    .empty-post{
                        font-size: 2rem;
                    }
                    .posts-header{
                        font-size: 1rem;
                    }  
                    }
                
            }
        }
    }
    
`;

export default Profile;