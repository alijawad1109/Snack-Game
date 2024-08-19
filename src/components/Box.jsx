"use client";
import React, { useState, useEffect, useRef } from "react";

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const boxSize = 350;
  const cellSize = 15;
  const initialSnake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 }, // Added to make the initial length 20px
  ];
  const initialDirection = { x: 1, y: 0 };

  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState(initialDirection);
  const [food, setFood] = useState(generateFood());

  function generateFood() {
    return {
      x: Math.floor(Math.random() * (boxSize / cellSize)),
      y: Math.floor(Math.random() * (boxSize / cellSize)),
    };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, boxSize, boxSize);

    // Draw Snake
    snake.forEach((segment) => {
      context.fillStyle = "green";
      context.fillRect(
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize,
        cellSize
      );
    });

    // Draw Food
    context.fillStyle = "red";
    context.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

    if (gameOver) {
      context.font = "30px Arial";
      context.fillStyle = "black";
      context.fillText("Game Over", boxSize / 2 - 80, boxSize / 2);
    }
  }, [snake, food, gameOver, canvasRef]);

  useEffect(() => {
    if (!started || gameOver) return;

    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [direction, gameOver, started]);

  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = {
          x: newSnake[0].x + direction.x,
          y: newSnake[0].y + direction.y,
        };

        // Check for collisions with walls
        if (
          head.x < 0 ||
          head.x >= boxSize / cellSize ||
          head.y < 0 ||
          head.y >= boxSize / cellSize
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check for collisions with itself
        if (
          newSnake.some(
            (segment) => segment.x === head.x && segment.y === head.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
          setScore((prevScore) => prevScore + 5);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [direction, food, gameOver, started]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score]);

  const resetGame = () => {
    setSnake(initialSnake);
    setDirection(initialDirection);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setStarted(false);
  };

  const startGame = () => {
    setStarted(true);
    setGameOver(false);
  };

  return (
    <div className="relative flex flex-col items-center p-4 h-[80vh] overflow-hidden">
      <div
        className={`absolute inset-0 ${
          gameOver ? "blur-sm" : ""
        } transition-all duration-300`}
      >
        <div className="flex justify-center flex-col items-center mt-4">
          <div className="mb-4 text-2xl font-semibold text-black ">
            Score: <span className="text-green-500">{score}</span> | High Score:{" "}
            <span className="text-red-500">{highScore}</span>
          </div>
          {!started && !gameOver && (
            <button
              onClick={startGame}
              className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded shadow-lg hover:bg-green-700 transition duration-300 animate-bounce"
            >
              Start Game
            </button>
          )}
        </div>
        {started && (
          <div className="my-3 flex justify-center items-center">
            <canvas
              ref={canvasRef}
              width={boxSize}
              height={boxSize}
              style={{ border: "2px solid #111" }}
              className="bg-white shadow-md max-h-[80vh]"
            ></canvas>
          </div>
        )}
      </div>

      {gameOver && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
          <div className="bg-white p-8 rounded shadow-lg w-[300px] flex flex-col justify-center items-center    ">
            <h2 className="text-2xl font-semibold mb-4">Game Over</h2>
            <div className="mb-4">
              <p className="text-xl">
                Your Score: <span className="text-green-500">{score}</span>
              </p>
              <p className="text-xl">
                High Score: <span className="text-red-500">{highScore}</span>
              </p>
            </div>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded shadow-lg hover:bg-green-700 transition duration-300"
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
