import React from "react";
import styled from "styled-components";
import Logo1 from "../assets/logo1.png";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { RiUserSettingsFill } from "react-icons/ri";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { BsPencilSquare } from "react-icons/bs";
import { FaCircleUser } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";

function SideNav({currentUser}) {
    const navigate = useNavigate();
    const handleLogOut = async() => {
            localStorage.clear();
            navigate("/login");
    };
    const handleProfile = (userID) => {

        navigate(`/profile/${userID}`);
      };
    

    return (
        <>
            {currentUser && (
                <Container>
                    <div className="brand">
                        <img src={Logo1} alt="logo" />
                        <h3>Maskify</h3>
                    </div>
                    <div className="buttons">
                        <div className="routes-container"><div className="route-logo"><FaHome /></div><Link to="/"className="routes"><h3>Home</h3></Link></div>
                        <div className="routes-container"><div className="route-logo"><RiUserSettingsFill /></div><Link to="/setAvatar"className="routes"><h3>Change Avatar</h3></Link></div>
                        <div className="routes-container"><div className="route-logo"><HiChatBubbleLeftRight /></div><Link to="/chat" className="routes"><h3>Chat</h3></Link></div>
                        <div className="routes-container"><div className="route-logo"><BsPencilSquare /></div><Link to="/compose" className="routes"><h3>Compose</h3></Link></div>
                        <div className="routes-container"><div className="route-logo"><FaCircleUser /></div> <div className="routes " onClick={()=>handleProfile(currentUser._id)}><h3>Profile</h3></div></div>
                        <div className="routes-container"><div className="route-logo"><FaPowerOff /></div><div className="routes last-route" onClick={handleLogOut}><h3>LogOut</h3></div></div>
                        <div className="_gap"></div>
                    </div>
                    <div className="nav-header">
                            <div className="avatar">
                                <img 
                                    src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}  
                                    alt = "avatar"
                                />
                            </div>
                            <div className="username" onClick={()=>handleProfile(currentUser._id)}>
                                <h2>{currentUser.username}</h2>
                            </div>
                    </div>
                </Container>
            )}
        </> 
    );
}

const Container = styled.div`
    background-color: #080420;
    display: grid;
    grid-template-rows: 10% 75% 15%;
    overflow: hidden;
    .brand {
        background-color: #ffffff39;
        display: flex;
        align-items: center;
        justify-content: center;
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
    .nav-header{
            background-color: #0d0d30;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            .avatar{
                img{
                    heignt: 5rem;
                    width: 3.5rem;
                }
            }
            .username{
                h2{
                    color: white;
                    cursor: pointer;
                }
            }
            
        @media screen and (max-width: 768px) {
            gap: 1rem;
            .avatar{
                img{
                    heignt: 5rem;
                    width: 3rem;
                }
            }
            .username{
                h2{
                    color: white;
                    font-size:1.2rem;
                }
            }
        }
    }
    .buttons{
        display: flex;
        flex-direction: column;
        ${'' /* align-items: center; */}
        overflow: auto;
        background-color: #080420;
        justify-content: flex-end;
        .routes-container{
            display:flex;
            color:white;
            gap:1.1rem;
            padding-left:1rem;
            min-height: 1.5rem;   
            width: 100%;
            border-radius: 0.2rem;
            padding: 0.4rem;
            transition: 0.5s ease-in-out;
                h3{
                    color: white;
                }
            .route-logo{
                display:flex;
                align-items:center;
                justify-content:center;
                font-size: 1rem;
                margin-bottom:0.1rem;
                padding-left:0.5rem;
            }
            .routes {
                cursor: pointer;
                text-decoration:none;
                gap: 1.1rem;
                align-items: center;
                display: flex;
                transition: 0.5s ease-in-out;
                h3{
                    color: white;
                }
            }
        }
            
        ._gap{
            height: 1.1rem;
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
`;

export default SideNav;


