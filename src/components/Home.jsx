import { signOut } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from './../firebase';

function Home(){
    const history = useNavigate()

    const handleClick = () =>{
        signOut(auth).then(val=>{
            console.log(val,"val")
            history('/')
        })
    }
    return(
        <div>
            <h1>Home</h1>
            <button onClick={handleClick}>SignOut</button>
        </div>
    )
}
export default Home;