"use client";

import { useState } from "react";

export default function AboutPage() {
  const [boxes, setBoxes] = useState<number[]>([]);

  const BOX_SIZE = 80;
  const GAP = 16;
  const STEP = BOX_SIZE + GAP;
  const CONTAINER_WIDTH = 600;
  const CONTAINER_HEIGHT = 300;
  const COLUMNS = Math.floor(CONTAINER_WIDTH / STEP);

  const handleAddBox = () => {
    setBoxes((prev) => [Date.now(), ...prev]);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        About Page
      </h1>

      <button
        onClick={handleAddBox}
        className="rounded-full bg-black px-6 py-3 text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
      >
        สร้างแผ่นสี่เหลี่ยม
      </button>

      {/* พื้นที่แสดงผล (เลื่อนได้) */}
      <div
        className="relative overflow-y-auto border border-dashed border-zinc-400"
        style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
      >
        {/* ความสูงรวมของ content */}
        <div
          className="relative"
          style={{
            height: Math.ceil(boxes.length / COLUMNS) * STEP,
          }}
        >
          {boxes.map((id, index) => {
            const col = index % COLUMNS;
            const row = Math.floor(index / COLUMNS);

            return (
              <div
                key={id}
                className="absolute h-20 w-20 rounded-md bg-blue-500
                           transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translate(${col * STEP}px, ${row * STEP}px)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
