import React, { useState } from "react";
import "./App.css";
import girl1 from "./img/girl1.png";
import girl2 from "./img/girl2.png";
import girl3 from "./img/girl3.png";
import girl4 from "./img/girl4.png";

import sound1 from "./sounds/sound1.mp3";
import sound2 from "./sounds/sound2.mp3";
import sound3 from "./sounds/sound3.mp3";
import sound4 from "./sounds/sound4.wav";
import dingSound from "./sounds/ding.wav"; // Ding sound for highlighting

const tilesData = [
  { id: 0, img: girl1, sound: sound1 },
  { id: 1, img: girl2, sound: sound2 },
  { id: 2, img: girl3, sound: sound3 },
  { id: 3, img: girl4, sound: sound4 },
];

function App() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState("Press Start to Play");
  const [shakingTile, setShakingTile] = useState(null);
  const [isHighlighting, setIsHighlighting] = useState(false); // Track highlighting state

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  const handleTileClick = (id) => {
    if (isHighlighting) return; // Prevent clicking during sequence highlighting

    const clickedTile = tilesData.find((tile) => tile.id === id);
    if (clickedTile) {
      playSound(clickedTile.sound); // Play the associated sound
    }
    setShakingTile(id); // Start shake animation
    setTimeout(() => setShakingTile(null), 500); // Remove shake after animation

    if (!isPlayerTurn) return;

    const newPlayerSequence = [...playerSequence, id];
    setPlayerSequence(newPlayerSequence);

    if (sequence[newPlayerSequence.length - 1] !== id) {
      setStatus("Game Over! Press Start to Try Again.");
      resetGame();
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setStatus("Correct! Get Ready for the Next Level.");
      setTimeout(() => {
        setLevel((prev) => prev + 1);
        setPlayerSequence([]);
        nextStep();
      }, 1000);
    }
  };

  const nextStep = () => {
    const randomTile = Math.floor(Math.random() * tilesData.length);
    setSequence((prev) => [...prev, randomTile]);
    setIsPlayerTurn(false);

    const updatedSequence = sequence.concat(randomTile);
    let delay = 500;
    setIsHighlighting(true); // Start highlighting sequence

    updatedSequence.forEach((tile, index) => {
      setTimeout(() => {
        highlightTile(tile);
        playSound(dingSound); // Play the "ding" sound during highlight
      }, delay * index);
    });

    setTimeout(() => {
      setIsPlayerTurn(true);
      setIsHighlighting(false); // End highlighting after sequence
      setStatus(`Level ${level + 1}: Your Turn`);
    }, delay * updatedSequence.length);
  };

  const highlightTile = (id) => {
    const tile = document.getElementById(`tile-${id}`);
    if (tile) {
      tile.classList.add("active");
      setTimeout(() => tile.classList.remove("active"), 300);
    }
  };

  const resetGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setLevel(0);
    setIsPlayerTurn(false);
  };

  const startGame = () => {
    resetGame();
    setStatus("Get Ready!");
    setTimeout(() => {
      nextStep();
    }, 1000);
  };

  return (
    <div className="App">
      <h1 style={{ textAlign: "center" }}>Anime Simon Game</h1>
      <div className="game-container">
        {tilesData.map((tile) => (
          <div
            key={tile.id}
            id={`tile-${tile.id}`}
            className={`tile ${shakingTile === tile.id ? "shake" : ""} ${
              isHighlighting ? "disabled" : ""
            }`}
            style={{ backgroundImage: `url(${tile.img})` }}
            onClick={() => handleTileClick(tile.id)}
          ></div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <h2>{status}</h2>
        <button onClick={startGame}>
          {status === "Press Start to Play" ? "Start" : "Restart the game"}
        </button>
      </div>
    </div>
  );
}

export default App;
