import { signOut } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./../firebase";
import ImageUpload from "./ImageUpload";

function Home() {
  const history = useNavigate();

  const handleClick = () => {
    signOut(auth).then((val) => {
      console.log(val, "val");
      history("/");
    });
  };
  return (
    <div>
      <div className="bg-gray-100 h-screen">
        <header className="bg-blue-500 p-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            onClick={handleClick}
          >
            SignOut
          </button>
        </header>

        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-semibold">Home</h1>
          <ImageUpload />
        </main>
      </div>
    </div>
  );
}
export default Home;
