"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Pixel = {
  id: number;
  x: number;
  y: number;
  color: string;
};

export default function Home() {
  const [pixels, setPixels] = useState<Pixel[]>([]);

  useEffect(() => {
    fetchPixels();

    const subscription = supabase
      .channel("pixels-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pixels" },
        (payload) => {
          const updatedPixel = payload.new as Pixel;
          setPixels((prev) =>
            prev.map((pixel) =>
              pixel.id === updatedPixel.id ? updatedPixel : pixel
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchPixels() {
    const { data, error } = await supabase.from("pixels").select("*");

    if (error) {
      console.error("Error fetching pixels:", error);
      return;
    }

    if (data) {
      setPixels(data);
    }
  }

  async function updatePixelColor(id: number, color: string) {
    const { error } = await supabase
      .from("pixels")
      .update({ color })
      .eq("id", id);

    return error;
  }

  function handlePixelClick(clickedPixel: Pixel) {
    const newColor = clickedPixel.color === "blue" ? "white" : "blue";

    // Save previous state for rollback
    const previousPixels = [...pixels];

    // Optimistic UI update
    setPixels((prevPixels) =>
      prevPixels.map((pixel) =>
        pixel.id === clickedPixel.id ? { ...pixel, color: newColor } : pixel
      )
    );

    // Update database
    updatePixelColor(clickedPixel.id, newColor).then((error) => {
      if (error) {
        alert("Failed to update pixel. Reverting changes.");
        setPixels(previousPixels); // rollback
      }
    });
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Pixel Revolution</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(100, 10px)",
          gridTemplateRows: "repeat(100, 10px)",
          gap: 1,
          border: "1px solid #ccc",
          width: "fit-content",
        }}
      >
        {pixels.map((pixel) => (
          <div
            key={pixel.id}
            style={{
              width: 10,
              height: 10,
              backgroundColor: pixel.color || "white",
              gridColumnStart: pixel.x,
              gridRowStart: pixel.y,
              cursor: "pointer",
            }}
            onClick={() => handlePixelClick(pixel)}
          />
        ))}
      </div>
    </main>
  );
}
