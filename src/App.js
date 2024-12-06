import React, { useState, useEffect } from "react";
import "./App.css";
import girl1 from "./img/girl1.png";
import girl2 from "./img/girl2.png";
import girl3 from "./img/girl3.png";
import girl4 from "./img/girl4.png";
import animegirl1 from "./img/animegirl1.png";
import animegirl2 from "./img/animegirl2.png";
import animegirl3 from "./img/animegirl3.png"; // New girl image
import animegirl4 from "./img/animegirl4.png"; // New girl image
import animegirl5 from "./img/animegirl5.png"; // New girl image

import sound1 from "./sounds/sound1.mp3";
import sound2 from "./sounds/sound2.mp3";
import sound3 from "./sounds/sound3.mp3";
import sound4 from "./sounds/sound4.wav";
import dingSound from "./sounds/ding.wav";
import correctSound from "./sounds/win.mp3";
import gameOverSound from "./sounds/fail.mp3";
import araSound from "./sounds/ara.mp3";
import backgroundVideo from "./img/back1.mp4";
import backgroundMusic from "./sounds/heartbreak.mp3";

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
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [showGirl, setShowGirl] = useState(false); // Control visibility of the girl
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showCorrectGirl, setShowCorrectGirl] = useState(false); // Control visibility of the correct girl
  const [correctGirlImage, setCorrectGirlImage] = useState(animegirl2); // Random girl to show on success

  const backgroundAudio = new Audio(backgroundMusic);
  backgroundAudio.loop = true;

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  const handleTileClick = (id) => {
    if (isHighlighting) return;

    const clickedTile = tilesData.find((tile) => tile.id === id);
    if (clickedTile) {
      playSound(clickedTile.sound);
    }
    setShakingTile(id);
    setTimeout(() => setShakingTile(null), 500);

    if (!isPlayerTurn) return;

    const newPlayerSequence = [...playerSequence, id];
    setPlayerSequence(newPlayerSequence);

    if (sequence[newPlayerSequence.length - 1] !== id) {
      setStatus("Game Over! Press Start to Try Again.");
      playSound(gameOverSound);
      playSound(araSound);
      resetGame();
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setStatus("Correct! Get Ready for the Next Level.");
      playSound(correctSound);

      // Randomly pick a girl image from the list
      const randomGirl = [animegirl2, animegirl3, animegirl4, animegirl5]; // Add all correct girls here
      setCorrectGirlImage(
        randomGirl[Math.floor(Math.random() * randomGirl.length)]
      );

      setShowCorrectGirl(true); // Show a random girl on success
      setTimeout(() => {
        setShowCorrectGirl(false); // Hide after a delay
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
    setIsHighlighting(true);

    updatedSequence.forEach((tile, index) => {
      setTimeout(() => {
        highlightTile(tile);
        playSound(dingSound);
      }, delay * index);
    });

    setTimeout(() => {
      setIsPlayerTurn(true);
      setIsHighlighting(false);
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
    setShowGirl(true); // Show the girl on Game Over
  };

  const startGame = () => {
    if (!isMusicPlaying) {
      backgroundAudio.volume = 0.1;
      backgroundAudio
        .play()
        .catch((err) => console.error("Audio play failed", err));
      setIsMusicPlaying(true);
    }
    resetGame();
    setShowGirl(false); // Hide the girl when the game starts
    setLevel(1);
    setStatus("Get Ready!");
    setTimeout(() => {
      nextStep();
    }, 1000);
  };

  useEffect(() => {
    const backgroundAudio = new Audio(backgroundMusic);
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.1; // Set volume to 30%
    // Attach event listener for user interaction
    const enableAudio = () => {
      if (!isMusicPlaying) {
        backgroundAudio
          .play()
          .catch((err) => console.error("Audio play failed", err));
        setIsMusicPlaying(true);
      }
      // Remove listener after first interaction
      window.removeEventListener("click", enableAudio);
    };

    window.addEventListener("click", enableAudio);

    return () => {
      window.removeEventListener("click", enableAudio);
    };
  }, [isMusicPlaying]);

  return (
    <div className="App">
      <video autoPlay loop muted className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div class="mainbox">
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
          {status === "Game Over! Press Start to Try Again." && (
            <button
              onClick={startGame}
              className={
                status === "Game Over! Press Start to Try Again."
                  ? "blinking"
                  : ""
              }
            >
              Restart the game
            </button>
          )}
          {status === "Press Start to Play" && (
            <button
              onClick={startGame}
              className={status === "Press Start to Play" ? "blinking2" : ""}
            >
              Start
            </button>
          )}
        </div>
      </div>

      {/* Girl on Game Over */}
      <div className={`girl-container ${showGirl ? "show" : ""}`}>
        <img src={animegirl1} class="bottomgirlpng" alt="Game Over Girl" />
      </div>
      <div
        className={`correct-girl-container ${showCorrectGirl ? "show" : ""}`}
      >
        <img
          src={correctGirlImage} // Use the randomly selected girl image here
          className="correct-girlpng"
          alt="Correct Move Girl"
        />
      </div>
    </div>
  );
}

export default App;
