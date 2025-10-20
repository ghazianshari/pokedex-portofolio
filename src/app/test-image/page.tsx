"use client";

import Image from "next/image";
import { useState } from "react";

export default function TestImage() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test</h1>
      <div className="space-y-4">
        <div>
          <p className="mb-2">CDN Image:</p>
          <Image
            src="https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/25.png"
            alt="Pikachu"
            width={96}
            height={96}
            unoptimized
            onError={() => setImageError(true)}
          />
        </div>
        {imageError && (
          <div className="text-red-500">CDN failed, trying alternative...</div>
        )}
      </div>
    </div>
  );
}
