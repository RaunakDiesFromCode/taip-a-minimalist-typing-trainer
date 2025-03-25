"use client"

import TypingHighlighter from '@/components/Input';
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col justify-center items-center h-[90vh]'>
      <div className='text-foreground/30 font-bold italic'>type</div>
      <TypingHighlighter targetText="hello" textSize="100px" />
    </div>
  );
}

export default page
