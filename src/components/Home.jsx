import React, { useState } from "react";
import { Login } from "./Login";
import { SignUp } from "./SignUp";

export const Home = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div>
      <div className="container bg-info rounded py-4 mt-3 text-center">
        <span className=" fs-1 d-block">CHATWAVES</span> 
        <span className="d-block">Your personal chatting app</span>
      </div>

      <div className="container d-flex justify-content-center  mt-3 rounded">
        <style>
          {`
          .card {
  perspective: 1000px;
  
}

.card-inner {
  position: relative;
  width: 400px;
  height: 600px;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.card-front {
  background-color: #333;
}

.card-back {
  background-color: #555;
  transform: rotateY(180deg);
}
        `}
        </style>

        <div className={`card ${isFlipped ? "" : "flipped"}`}>
          <div className="card-inner">
            <SignUp handleFlip={handleFlip} />
            <Login handleFlip={handleFlip} />
          </div>
        </div>
      </div>
    </div>
  );
};
