import React, {useState, useEffect} from "react";
import styled from "styled-components"; // used to write css in js
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo1.png";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from 'uuid';

function Register(){

    const navigate = useNavigate();
   
    const [values,setValues]=useState({
        email:"",
        password:"",
        confirmPassword:"",
        gender:"male",
        age:""
    });

    const [username,setUsername] = useState("");

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    } 

    useEffect(()=>{
        if(localStorage.getItem("chat-app-user")){
            navigate('/');
        }
    },[]);
    
    async function handleSubmit(event){
        event.preventDefault();
        generateUserName();
        console.log(username);
        if( username!=="" & handleValidation()){
            console.log("inValidation",registerRoute)
            const {email, password, gender, age} = values;
            const {data} = await axios.post(registerRoute, {
                username,
                email,
                password,
                gender,
                age
            });
            if(data.status === false){
                toast.error(data.msg,toastOptions);
            }
            if(data.status === true){
                console.log("Data",data);
                localStorage.setItem("chat-app-user",JSON.stringify(data.user));
                navigate("/setAvatar");
            }
        }
    }
    function handleChange(event){
        const {name,value} = event.target;
        setValues((preValues)=>{
            return{
                ...preValues,
                [name]:value,
            }
        })
    }

    const handleValidation = () => {
        const {email, password, confirmPassword, age} = values;
        if(password !== confirmPassword) {
            toast.error("password and confirm password are not same.",toastOptions);
            return false;
        } 
        else if (password.length < 8){
            toast.error("password should be equal or grater than 8 characters.",toastOptions);
            return false;
        }
        else if (email===""){
            toast.error("email is required",toastOptions);
            return false;
        }
        else if (isNaN(age) || age < 12) { // Added age validation
            toast.error("Age should be a number and greater than 12.", toastOptions);
            return false;
        }
        return true;
    };
    
    const generateUserName = () => {
        const uniqueIdentifier = uuidv4();
        const truncatedIdentifier = uniqueIdentifier.substr(0,5);
        const readableUsername = `mask_${truncatedIdentifier}`;
        setUsername(readableUsername);
        console.log(readableUsername);
    }
    

    return (
        <> 
        {/* <> short hand for React Fragment. Used to wrap elemnts by avoiding dom node */}
            <FormContainer>
                <form onSubmit={handleSubmit}>
                   <div className="brand">
                    <img src={Logo} alt="Logo" />
                    <h1>Maskify</h1>
                   </div> 
                   <input type="email" placeholder="Email" name="email" onChange={handleChange}></input>
                   <input type="password" placeholder="Password" name="password" onChange={handleChange}></input>
                   <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange}></input>
                   <select name="gender" onChange={handleChange} defaultValue="male">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <input type="number" placeholder="Age" name="age" onChange={handleChange}></input>
                   <button type="submit">Create User</button>
                   <span>
                    Already have an account ? <Link to="/login">Login</Link>
                   </span>
                </form>
 
            </FormContainer>
            <ToastContainer />
        </>
    )
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #080420;

    .brand{
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height:5rem;
            border-radius:30%;
        }
        h1 {
            color:white;
        }
    }
    form {
        display: flex;
        flex-direction:column;
        gap: 1.5rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 2rem 3rem;
        max-width: 480px; 
        width: 100%; 
    }
    input, select{
        background-color: transparent;
        padding: 0.75rem;
        border: 0.1rem solid #4e0eff;
        color: white;
        width: 100%;
        font-size:1rem;
        &:focus {
            border: 0.1rem solid #997af0;
            outline: none;
        }
        option {
            color: white;
            background-color: #131324;
        }
    }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        
        ::placeholder,
        :-moz-placeholder {
            color: white;
        }
    }

    button{
        background-color: #997af0;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.5s ease-in-out;
        &:hover{
            background-color: #4e0eff;
        }
    }
    span{
        color:white;
        text-transform: uppercase;
        a{
            color:#4e0eff;
            text-decoration: none;
            font-weight: bold;
        }
    }
    p {
        color:white;
    }

`;

export default Register;