import React from "react";
import styled from "styled-components";
import UsersImage from "../assets/users.png";
import Logo from "../assets/logo1.png";
import { useNavigate } from "react-router-dom";

function LandingPage() {

    const navigate = useNavigate();

    function handleLogin(){
        navigate('/login');
    }
    function handleSignUp(){
        navigate('/register');
    }
  return (
    <Container>
      <div className="container">
        <div className="details-container">
          <div className="header">
            <img src={Logo} alt="logo" />
            <h1>Maskify</h1>
          </div>
          <div className="slogan">
            <h2>An Anonymous Expression Platform with Social Connectivity</h2>
          </div>
          <div className="features">
            <h3>Features:</h3>
            <ul>
              <li>Anonymous sharing of opinions, thoughts and confessions</li>
              <li>Ask questions anonymously</li>
              <li>Real-time chatting with other anonymous users</li>
              <li>Privacy protection and user moderation</li>
              <li>User reporting for violations</li>
              <li>Anticipated community feature addition ... </li>
              {/* Add more features as needed */}
            </ul>
          </div>
          <div className="btn-container">
            <button className="login-btn" onClick={handleLogin}>Login</button>
            <button className="signup-btn" onClick={handleSignUp}>Sign Up</button>
          </div>
        </div>
        <div className="img-container">
          <img src={UsersImage} alt="img" />
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #080420;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    height: 80vh;
    width: 80vw;
    background-color: #1f1c32;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    .details-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem;

      .header {
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
          height: 6rem;
          width: auto;
          border-radius: 50%;
        }

        h1 {
          font-size: 2.5rem;
          color: #eee;
        }
      }

      .slogan {
        margin-top: 2rem;

        h2 {
          font-size: 1.5rem;
          color: #ccc;
          text-align: center;
        }
      }

      .features {
        margin-top: 2rem;
        text-align: left;

        h3 {
          font-size: 1.2rem;
          color: #eee;
          margin-bottom: 1rem;
        }

        ul {
          list-style-type: disc;
          margin-left: 2rem;
        }

        li {
          font-size: 1rem;
          color: #ccc;
          margin-bottom: 0.5rem;
        }
      }

      .btn-container {
        margin-top: 2rem;

        button {
            
          padding: 1rem 2rem;
          margin-right: 1rem;
          border: none;
          border-radius: 0.5rem;
          background-color:#997af0 ;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.5s ease-in-out;
          &:hover {
            background-color: #4e0eff;
          }
        }
      }
    }

    .img-container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        height: 80%;
        width: auto;
      }
    }
  }

  @media screen and (max-width: 768px) {
    .container {
      flex-direction: column;

      .details-container {
        padding: 1rem;
      }

      .btn-container {
        margin-top: 1rem;
        flex-direction: column;

        button {
          margin-right: 0;
          margin-bottom: 1rem;
        }
      }
      .img-container {
      display: none;
    }
    }

    
  }
`;

export default LandingPage;
