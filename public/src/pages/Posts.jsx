import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SideNav from "./SideNav";
import PostContainer from "./PostContainer";
import {getPosts} from "../utils/APIRoutes";
import axios from "axios";



function Posts() {

    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [posts, setAllPosts]= useState([]);
    useEffect( () =>{
        async function fetchCurrentUser() {

            if(!localStorage.getItem("chat-app-user")){
                navigate("/login");
            } else {
                setCurrentUser ( await JSON.parse(localStorage.getItem("chat-app-user")));
                setIsLoaded(true);
            }
        };
        fetchCurrentUser();
    }, []);

    useEffect( () => {
        async function fetchAllPosts(){
            try{
                if(!currentUser) return;
                const response = await axios.get(getPosts);
                if(response.status === 200){
                    setAllPosts(response);
                } else {
                    console.log("Failed to fetch posts");
                }
            } catch (error) {
                console.log('Error fetching posts:', error);
            }
        }
        if (isLoaded) {
            console.log("Posts",posts);
            fetchAllPosts();
        }
    },[isLoaded]);

    return (
        <>
            <Container>
                <div className="container">
                    <SideNav currentUser={currentUser}></SideNav>
                    <PostContainer posts={posts} ></PostContainer>
                    {/* <UserPostProfile postss = {posts}></UserPostProfile> */}
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

    .container{
        height: 100vh;
        width: 100vw;
        background-color:#131324 ;
        display: grid;
        grid-template-columns: 20% 80%;
         @media screen and (min-width: 600px) and (max-width: 1080px){
            grid-template-columns: 35% 65%;
         }
    }
`;

export default Posts;


