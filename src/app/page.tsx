"use client"

import TypingHighlighter from '@/components/Input';
import React from 'react'

const page = () => {
  return (
    <div className='flex justify-center items-center h-[90vh]'>
      <TypingHighlighter targetText="hello" textSize="100px" />
    </div>
  );
}

export default page
