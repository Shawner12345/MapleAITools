import React, { useState, useEffect, useCallback } from 'react';

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

export default function TypewriterText({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000
}: TypewriterTextProps) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  const typeText = useCallback(() => {
    const currentWord = words[currentIndex];
    
    if (isDeleting) {
      setCurrentText(prev => prev.slice(0, -1));
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentIndex(prev => (prev + 1) % words.length);
      }
    } else {
      if (currentText.length < currentWord.length) {
        setCurrentText(currentWord.slice(0, currentText.length + 1));
      } else {
        setTimeout(() => setIsDeleting(true), delayBetweenWords);
      }
    }
  }, [currentText, currentIndex, isDeleting, words, delayBetweenWords]);

  useEffect(() => {
    const timeout = setTimeout(
      typeText,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [typeText, isDeleting, typingSpeed, deletingSpeed]);

  return (
    <span className="text-brand-accent">
      {currentText}
      <span 
        className={`inline-block w-[4px] h-[1em] ml-1 -mb-1 bg-brand-accent ${
          cursorVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transition: 'opacity 0.1s' }}
      />
    </span>
  );
}