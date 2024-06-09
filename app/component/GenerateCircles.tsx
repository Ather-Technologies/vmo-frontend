"use client"

import React, { useState, useEffect, useRef } from 'react';

function GenerateCircles() {
  const [circles, setCircles] = useState<{ x: number; y: number; radius: number; color: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Canvas context not found');
      return;
    }

    const pixelRatio = window.devicePixelRatio;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Scale the context to match the new pixel density
    ctx.scale(pixelRatio, pixelRatio);

    let i = 0;
    const intervalId = setInterval(() => {
      const x = Math.floor(Math.random() * canvas.width);
      const y = Math.floor(Math.random() * canvas.height);
      const radius = Math.floor(Math.random() * 50) + 10;
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      setCircles(prevCircles => [...prevCircles, { x, y, radius, color }]);

      i++;
      //if (i >= 100) { // stop after 100 iterations
      //  clearInterval(intervalId);
      //}
    }, 50); // delay of 0.05 second between each iteration

    return () => clearInterval(intervalId); // cleanup function to clear the interval
  }, []); // empty dependency array to run only once

  return (
    <canvas id="myCanvas" ref={canvasRef}></canvas>
  );
}

export default GenerateCircles;