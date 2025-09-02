"use client";

import { useState } from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Avatar({
  src,
  alt,
  size = "md",
  className = "",
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const fallbackAvatar = (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs border-2 border-gray-600 ${className}`}
    >
      {alt ? getInitials(alt) : "U"}
    </div>
  );

  if (!src || imageError) {
    return fallbackAvatar;
  }

  return (
    <img
      src={src}
      alt={alt || "User avatar"}
      className={`${sizeClasses[size]} rounded-full border-2 border-gray-600 object-cover ${className}`}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
  );
}
