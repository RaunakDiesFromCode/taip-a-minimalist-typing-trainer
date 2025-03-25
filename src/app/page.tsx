"use client"

import TypingHighlighter from '@/components/Input';
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[85vh] mt-10">
      {/* <div className="text-foreground/30 font-bold italic">type</div> */}
      <TypingHighlighter />
    </div>
  );
}

export default page
