 import React, {useState, useEffect} from "react";
 import styled from "styled-components";
 import Logo from "../assets/logo1.png";
 import { Link, useNavigate } from "react-router-dom";
 import { FaHome } from "react-icons/fa";
 import { RiUserSettingsFill } from "react-icons/ri";
 import { HiChatBubbleLeftRight } from "react-icons/hi2";
 import { BsPencilSquare } from "react-icons/bs";
 import { FaCircleUser } from "react-icons/fa6";

 function Contacts({ contacts, currentUser, changedChat}){
    const navigate = useNavigate();
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    useEffect(()=>{
        contacts.map(contact =>{
            console.log("Hello:",contact.username);
        }) 
       if(currentUser){
        setCurrentUserImage(currentUser.avatarImage);
        setCurrentUserName(currentUser.username);
        console.log(currentUser.username);
       } 
    }, [currentUser]);
    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changedChat(contact);
    };

    const handleLogOut = async() => {
        localStorage.clear();
        navigate("/login");
    };
    const handleProfile = (userID) => {

        navigate(`/profile/${userID}`);
    };
    return  (
        <>
            {currentUserImage && currentUserName && (
                <Container>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h3>Maskify</h3>
                    </div>
                    
                    <div className="contacts">
                        <div className="contact-header">Contacts</div>
                        {
                            contacts.map((contact,index)=>{
                                return (
                                    <div className={`contact ${index === currentSelected ? "selected" : ""}`} key={index}
                                        onClick={() => changeCurrentChat(index,contact)}
                                    >
                                       <div className="avatar">
                                        <img 
                                            src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                            alt="avatar"
                                            />
                                       </div> 
                                       <div className="username">
                                            <h3>{contact.username}</h3>
                                       </div> 
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="buttons">
                    <div className="routes-container"><div className="route-logo"><FaHome /></div><Link to="/"className="routes"><h3>Home</h3></Link></div>
                        <div className="routes-container"><div className="route-logo"><RiUserSettingsFill /></div><Link to="/setAvatar"className="routes"><h3>Change Avatar</h3></Link></div>
                        <div className="routes-container"><div className="route-logo"><HiChatBubbleLeftRight /></div><Link to="/chat" className="routes"><h3>Chat</h3></Link></div>
                        <div className="routes-container"><div className="route-logo"><BsPencilSquare /></div><Link to="/compose" className="routes"><h3>Compose</h3></Link></div>
                        <div className="routes-container"><div className="route-logo"><FaCircleUser /></div> <div className="routes " onClick={()=>handleProfile(currentUser._id)}><h3>Profile</h3></div></div>
                        <div className="_gap"></div>
                    </div>
                    <div className="current-user">
                        <div className="avatar">
                          <img 
                            src={`data:image/svg+xml;base64,${currentUserImage}`}  
                            alt = "avatar"
                          />
                        </div>
                        <div className="username" onClick={()=>handleProfile(currentUser._id)}>
                            <h2>{currentUserName}</h2>
                        </div>
                    </div>
                </Container>
            )}
        </>
    )
 };

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 58% 20% 12%;
    overflow: hidden;
    background-color: #080420;

    .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ffffff39;
        gap: 1rem;
        img{
            height: 4rem;
            border-radius:30%;
        }
        h3{
            color: white;
            text-transform: uppercase;
        }
        @media screen and (max-width: 780px){
            img{
                height: 3rem;
                border-radius:30%;
            }
            h3{
                font-size: 1.2rem;
            }
        }
    }
    .contacts{
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.5rem;
        padding-bottom:0.9rem;
        padding-top: 0.9rem;
        &:: -webkit-scrollbar{
           width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .contact-header{
            color: white;
        }
        .contact {
            background-color: #1f1c32;
            height: 3rem;   
            width: 93%;
            cursor: pointer;
            border-radius: 0.2rem;
            padding: 0.4rem;
            gap: 1rem;
            align-items: center;
            display: flex;
            transition: 0.5s ease-in-out;

            .avatar{
                img{
                    height: 2.4rem;
                }
            }
            .username {
                cursor:pointer;
                h3{
                    color: white;
                    font-size: 1.2rem;

                }
            }
            @media screen and (max-width: 780px){
                .avatar{
                    img{
                        height: 2.1rem;
                    }
                }
            .username{
                h3{
                    font-size: 1rem;
                }
            }
        }
        }
        .selected{
            background-color: #9186f3;
        }
        
    }
    .buttons{
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.3rem;
        background-color: #080420;
        justify-content: flex-end;
        padding-top: 1rem;
        .routes-container{
            display:flex;
            color:white;
            gap:1.1rem;
            padding-left:1rem;
            min-height: 1.5rem;   
            width: 100%;
            border-radius: 0.2rem;
            padding: 0.4rem;
            font-size: 0.95rem;
            cursor: pointer;
            transition: 0.5s ease-in-out;
                h3{
                    color: white;
                }
                .route-logo{
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size: 0.9rem;
                    margin-bottom:0.1rem;
                    padding-left:0.5rem;
                }
            }
            .routes {
                ${'' /* background-color: #ffffff39; */}
               
                text-decoration:none;
                
                display: flex;
                align-items: center;
                transition: 0.5s ease-in-out;
                font-size: 0.95rem;
                h3{
                    color: white;
                }
            }
        ._gap{
            height: 1rem;
            width:100%;
        }
        .routes-container:hover {
            background-color: #ffffff39;
            transition: 0.5s ease-in-out;
        }
        @media screen and (max-width: 780px) {
            font-size: 0.8rem;
            gap:0rem;
            ._gap{
            height: 0.4rem;
            width:100%;
        }
        }
    }
        
        .current-user {
            background-color: #0d0d30;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            .avatar{
                img{
                    heignt: 4rem;
                    max-inline-size: 100%;
                    width: 3rem;
                }
            }
            .username{
                h2{
                    color: white;
                }
            }
        }
        @media screen and (min-width: 720px) and (max-width: 1080px){
                .username{
                    h2{
                        font-size: 1rem;
                    }
                }
                .contacts{
                    padding-top:0.4rem;
                    gap:0.4rem;
                }
            }
    
    

`;
  

 export default Contacts;