import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {upvote, addComment, addContact, report} from "../utils/APIRoutes";
import { FaCommentDots } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdOutlineReportProblem } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";
import {ToastContainer, toast} from "react-toastify";
import DOMPurify from 'dompurify';



function UserPostProfile({postss}) {

  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const [showCommentInput, setShowCommentInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState({});
  const [commentCount, setCommentCount] = useState({});
  const [currentUserId , setCurrentUserId] = useState(undefined);
 
  const toastOptions = {
    position: "bottom-right",
    autoClose: 1500,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
} 
  useEffect( () => {
    async function fetchCurrentUser() {
        if(!localStorage.getItem("chat-app-user")){
            navigate("/login");
        } else {
            setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
            setCurrentUserId( await JSON.parse(localStorage.getItem("chat-app-user"))._id);
        }
    };
    fetchCurrentUser();
  },[]);



useEffect(() => {
    async function fetchAllPosts() {
      try {
        if (!currentUser || !postss || !Array.isArray(postss.data)) return; // Check if postss.data is an array
        const responseData = postss.data;
  
        const initialLikes = {};
        const initialUserLikes = {};
        const initialComments = {};
        const initialCommentCount = {};
  
        const promises = responseData.map(async (post) => {
          const commentResponse = await axios.get(`http://localhost:5000/api/posts/${post._id}/comments`);
          initialComments[post._id] = commentResponse.data;
        });
        await Promise.all(promises);
  
        // const filteredPosts = responseData.filter((post) => !post.reported.includes(currentUser._id));
        // filteredPosts.forEach(post => {
        //   initialLikes[post._id] = post.likes;
        //   initialUserLikes[post._id] = post.likedby;
        // });
        responseData.forEach(post => {
          initialLikes[post._id] = post.likes;
          initialUserLikes[post._id] = post.likedby;
          initialCommentCount[post._id] = post.comments.length;
        });
  
        setPosts(responseData);
        setLikes(initialLikes);
        setUserLikes(initialUserLikes);
        setComments(initialComments);
        setCommentCount(initialCommentCount);
      } catch (error) {
        console.log('Error fetching posts:', error);
      }
    }
    fetchAllPosts();
  }, [currentUser, postss]);
  

  const handleUpvote = async(postID) => {
    try{
      const response = await axios.post(upvote, {
        postId : postID,
        likedBy : currentUser._id,
      });
      if(response.status===200 && response.data.flag === 1){
        setUserLikes((prevUserLikes) => ({
          ...prevUserLikes,
          // [postID]: prevUserLikes[postID].push(currentUser._id),
          [postID]: [...(prevUserLikes[postID] || []), currentUser._id],
        }))
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postID]: prevLikes[postID] ? prevLikes[postID]+1 : 1,
        }))
      }
      if(response.status===200 && response.data.flag === 0){
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postID]: prevLikes[postID] - 1,
        }))
        setUserLikes((prevUserLikes) => ({
          ...prevUserLikes,
          // [postID]: prevUserLikes[postID].filter(userId => userId !== currentUser._id),
          [postID]: (prevUserLikes[postID] || []).filter(userId => userId !== currentUser._id),
        }))
      }
    } catch (err){

    }
  };

  const handleAddComment = async(postID) => {
    try{
      const response = await axios.post(addComment,{
        postId: postID,
        commentInput: commentInput,
        user: currentUser._id,
      });
      if(response.status === 201 && response.data.success===true){
        const comment = response.data.comment;
        setCommentInput("");
        setComments((prevComments) => ({
          ...prevComments,
          [postID]: [comment,...prevComments[postID]],
        }))
        setCommentCount((prevCommentCount) => ({
          ...prevCommentCount,
          [postID]: prevCommentCount[postID]+1,
        })
        )
        
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleCommentInput = (postID) => {
    setShowCommentInput((prev) => (prev===postID ? "" : postID));
  }
  
  const toggleReport = (postID) => {
    setShowReport(prevState => ({...prevState, [postID]: !prevState[postID]}));
  };

  const handleReport = async(postID) => {
    try{
      const response =  await axios.post(report,{
        userId : currentUser._id,
        postId : postID,
      });
    if(response.status===200){
      // setPosts(posts.filter(post => post._id !== postID));
      toast("Post reported successfully", toastOptions);
    }
    } catch (error) {
      console.log(error);
    }
    
  };

  const handleProfile = (userID) => {

    navigate(`/profile/${userID}`);
  };

  return(
    <PostWrapper>
     { posts.map((post) => {
      return(
        <Container key={post._id}>
          <div className='post-header'>
            <div className='avatar-img'>
              <img
                src={`data:image/svg+xml;base64,${post.avatarImage}`}
                alt="avatar"
              />
            </div>
            <div className='posted-by' onClick={()=>handleProfile(post.userId)}>
              <span>{post.username}</span>
            </div>
            <div className='dots-btn' onClick = {()=>toggleReport(post._id)}>
              <HiOutlineDotsVertical/>
            {showReport[post._id] && (
                <div className={`report-popover ${currentUserId === post.userId ? 'disabled' : ''}`} onClick={() => currentUserId !== post.userId && handleReport(post._id)}>
                    <MdOutlineReportProblem />
                    <span>Report</span>
                </div>
            )}
            </div>
          </div>
          <div className='post-body' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.content)}}>
      
          </div>
          <div className='post-footer'>
            <div className='impression-btn'>
              <div className="upvote-btn" onClick={() => handleUpvote(post._id)}>
                <FaHeart className={userLikes[post._id] && userLikes[post._id].includes(currentUser._id) ? "liked-icon" : ""} />
                <span>{likes[post._id]}</span>
              </div>
            </div>
            <div className='comment'>
              <FaCommentDots onClick={()=>toggleCommentInput(post._id)}/>
              <span>{commentCount[post._id]}</span>
            </div>
            
          </div>
          {showCommentInput === post._id && (
            <div className='comment-input'>
              <input
                type='text'
                placeholder='Add a comment'
                value={commentInput}
                onChange = {(e)=>setCommentInput(e.target.value)}
              />
              <button onClick={() => handleAddComment(post._id)}>Post</button>
            </div>
          )}
          {showCommentInput===post._id && comments[post._id] && (
            <div className='comment-container'>
              {comments[post._id].map((comment,index) => (
                <div className='comment-section'key={comment._id}>
                  <div className='comment-header'>
                    <div className='avatar-img'>
                      <img
                        src={`data:image/svg+xml;base64,${comment.user.avatarImage}`}
                        alt="avatar"
                      />
                    </div>
                    <div className = 'username'>
                      <span>{comment.user.username}</span>
                    </div>
                  </div>
                  <div className='comment-body'>
                    <p>{comment.text}</p>
                  </div>
                  {index !== comments[post._id].length - 1 && <hr />}
                </div>
  
              ))}
            </div>
          ) }
        </Container>
      );
    })}
      <ToastContainer />
    </PostWrapper>
  )
}


const PostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
  gap: 1rem;
  overflow-y: auto; 
  max-height: calc(100vh - 18.5rem);
  &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff1f;
        width: 0.1rem;
        border-radius: 1rem;
      }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 53%;
  border: 1px solid #080420;
  background-color: #393745;
  color: white;
  padding: 10px 15px;
  gap: 0.75rem;
  border-radius:5px;
   
 
  .post-header{
    display:flex;
    align-items: center;
    gap:0.75rem;
  

    .avatar-img{
      img{
        height:2.3rem;
      }
    }

    .chat-btn{
      display: flex;
      align-items:center;
      justify-content:center;
      height:1.75rem;
      width:3.25rem;
      border-radius: 5px;
      margin-left: auto;
      cursor:pointer;
      background-color:#232038 ;
      &:hover{
        background-color:#403c58;      }
    } 

  }

  .post-body{
    border-radius: 10px;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto; 
  }

  .post-footer{
    display: flex;
    gap: 1.5rem;

    .impression-btn{
      display: flex;
      gap:0.5rem;
      justify-content:center;
      align-items:center;
      .liked-icon{
        color: red;
        font-size:1.25rem;
        color:#9a86f3;
      }
      .upvote-btn{
        display:flex;
        justify-content:center;
        align-items:center;
        gap:0.2rem;
        span{
          font-size:1rem;
        }
      }
    }
    .comment{
      display: flex;
      gap:0.2rem;
      justify-content:center;
      align-items:center;
    }
  }
  .dots-btn {
      cursor: pointer;
      position: relative;
      margin-left: auto;
      .report-popover {
        display:flex;
        justify-content:center;
        align-items:center;
        gap:0.2rem;
        height:2rem;
        padding: 5px;
        position: absolute;
        top: calc(100% + 10px);
        left: 0%;
        transform: translateX(-60%);
        background-color: #312e45;
        ${'' /* border: 1px solid #ccc; */}
        border-radius: 5px;
        padding: 5px;
        z-index: 999;
        span {
          cursor: pointer;
          font-size:0.75rem;
        }
      }
      .report-popover.disabled {
          opacity: 0.85;
          ${'' /* pointer-events: none; */}
          cursor: not-allowed;
          span {
          cursor: not-allowed;
          font-size:0.75rem;
        }
      }
  }
  .comment-container{
    display:flex;
    flex-direction: column;
    max-height: 10rem;
    overflow-y: auto; 
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff1f;
        width: 0.05rem;
        border-radius: 1rem;
        ${'' /* display:none; */}
      }
      
    }
    hr{
      
      border: none; 
      border-top: 1px solid #ffffff1f;
      margin: 0.5rem 0;
      width: 100%;
    }
  }
  .comment-section{
    display:flex;
    flex-direction: column;
    max-width: 80%;
    padding: 0 0.4rem;
    border-radius:0.7rem;
   
    
    .comment-header{
      display:flex;
      gap:0.4rem;
      align-items:center;
    
      .avatar-img{
        display: flex;
        align-items:center;
        justify-content: center;
        height:auto;
        width:1.5rem;
      }
      .username{
        color: white;
        font-size: 0.85rem;
        color:#cfcfd4;
        span{
          display: flex;
        align-items:center;
        justify-content: center;
        }
      }
    }
    .comment-body{
      p{
        margin-left: 1.9rem;
        font-size: 0.8rem;
        max-width: 70%; 
        word-wrap: break-word;
        color: #f1f1f8;
      }
    }
   
  }
  
  .comment-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width:75%;
    input {
      flex: 1;
      padding: 0.5rem;
      border-radius: 5px;
      border: 1px solid #080420 ;
      background-color: #393745;
      color: white;
    }
    button {
      padding: 0.5rem 1rem;
      border-radius: 5px;
      border: none;
      background-color: #232038;
      
      color: white;
      cursor: pointer;
      transition: background-color 0.3s;
      &:hover {
      
        background-color: #403c58;
      }
    }
  }
  @media screen and (min-width: 720px) and (max-width: 1080px){
         width:75%;   
         }

`;

export default UserPostProfile;
