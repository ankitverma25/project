"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const FloatingLabelInput = ({ id, label, type = "text", value, onChange, name }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <input
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <motion.label
        htmlFor={id}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-bold pointer-events-none bg-white"
        initial={{ y: "-50%", scale: 1 }}
        animate={{
          y: isFocused || value ? "-110%" : "-10%",
          scale: isFocused || value ? 0.9 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {label}
      </motion.label>
    </div>
  );
};

export default FloatingLabelInput;