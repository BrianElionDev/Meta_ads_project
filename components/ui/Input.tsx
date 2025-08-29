"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="border rounded-xl p-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
      />
    </div>
  );
}