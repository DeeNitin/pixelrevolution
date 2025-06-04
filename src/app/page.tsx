'use client';

import React, { useState } from 'react';

const GRID_SIZE = 10;

export default function Home() {
  // Create an array for pixels (initially unclaimed)
  const [pixels, setPixels] = useState(
    Array(GRID_SIZE * GRID_SIZE).fill({ owner: null, color: '#eee' })
  );

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">PixelRevolution</h1>
      <div
        className="grid grid-cols-10 gap-1"
        style={{ maxWidth: 500 }}
      >
        {pixels.map((pixel, index) => (
          <div
            key={index}
            className="w-10 h-10 cursor-pointer border border-gray-300"
            style={{ backgroundColor: pixel.color }}
          />
        ))}
      </div>
    </main>
  );
}
