'use client';

import React, { useState } from 'react';

const GRID_SIZE = 10;

export default function Home() {
  // Define pixel grid with color and owner
  const [pixels, setPixels] = useState(
    Array(GRID_SIZE * GRID_SIZE).fill({ owner: null, color: '#eee' })
  );

  // Handle pixel click
  function handleClick(index: number) {
    const newPixels = [...pixels];
    newPixels[index] = {
      owner: 'guest', // placeholder for now
      color: '#f87171', // red-400 when claimed
    };
    setPixels(newPixels);
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">PixelRevolution</h1>
      <div className="grid grid-cols-10 gap-1" style={{ maxWidth: 500 }}>
        {pixels.map((pixel, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="w-10 h-10 cursor-pointer border border-gray-300 transition"
            style={{ backgroundColor: pixel.color }}
          />
        ))}
      </div>
    </main>
  );
}
