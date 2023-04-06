import React, { useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #0b3d91;
    color: white;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  background-color: rgba(11, 61, 145, 0.8);
  padding: 20px;
  border-radius: 8px;
`;

const GameCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const UnderConstruction: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let animationFrameId: number;

    const cellSize = 10;
    const cellSpacing = 2;
    const animationSpeed = 200; // milliseconds between generations

    const getGridSize = () => {
      if (!canvas) return { rows: 0, cols: 0 };
      return {
        rows: Math.floor(canvas.height / (cellSize + cellSpacing)),
        cols: Math.floor(canvas.width / (cellSize + cellSpacing)),
      };
    };

    const createEmptyGrid = (rows: number, cols: number) => {
      return new Array(rows).fill(null).map(() => new Array(cols).fill(false));
    };

    const randomizeGrid = (grid: boolean[][]) => {
      return grid.map((row) => row.map(() => Math.random() > 0.35));
    };

    const countNeighbors = (grid: boolean[][], row: number, col: number) => {
      const neighbors = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];

      return neighbors.reduce((acc, [rDiff, cDiff]) => {
        const newRow = row + rDiff;
        const newCol = col + cDiff;

        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[row].length) {
          return acc + (grid[newRow][newCol] ? 1 : 0);
        }
        return acc;
      }, 0);
    };

    const getNextGeneration = (grid: boolean[][]) => {
      return grid.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          const neighbors = countNeighbors(grid, rowIndex, colIndex);
          if (cell) {
            return neighbors === 2 || neighbors === 3;
          } else {
            return neighbors === 3;
          }
        });
      });
    };

    const drawGrid = (grid: boolean[][]) => {
      if (!ctx) return;
      if (!canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          ctx.fillStyle = cell ? 'white' : 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(
            colIndex * (cellSize + cellSpacing),
            rowIndex * (cellSize + cellSpacing),
            cellSize,
            cellSize,
          );
        });
      });
    };

    const isGridMostlyDead = (grid: boolean[][]) => {
      const totalCells = grid.length * grid[0].length;
      const liveCells = grid.flat().filter((cell) => cell).length;
      return liveCells / totalCells < 0.05;
    };

    const gameOfLife = () => {
      const { rows, cols } = getGridSize();
      let grid = randomizeGrid(createEmptyGrid(rows, cols));

      const animate = () => {
        grid = getNextGeneration(grid);
        drawGrid(grid);

        if (isGridMostlyDead(grid)) {
          grid = randomizeGrid(grid);
        }

        setTimeout(() => {
          animationFrameId = requestAnimationFrame(animate);
        }, animationSpeed);
      };

      animate();
    };

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const debounce = (func: Function, wait: number) => {
      let timeout: ReturnType<typeof setTimeout> | null = null;

      return (...args: any[]) => {
        const later = () => {
          timeout = null;
          func(...args);
        };

        if (timeout !== null) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
      };
    };

    const startGame = () => {
      if (canvas) {
        resizeCanvas();
        if (ctx) {
          gameOfLife();
        }
      }
    };

    //const handleResize = debounce(() => {
    //  if (animationFrameId) {
    //    cancelAnimationFrame(animationFrameId);
    //  }
    //  startGame();
    //}, 300);

    resizeCanvas();
    gameOfLife();

    //window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      //window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>
        <h1>We'll be right back</h1>
        <p>This app is being upgraded. Please check back soon!</p>
      </Container>
      <GameCanvas ref={canvasRef} />
    </>
  );
};

export default UnderConstruction;
