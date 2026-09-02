import React, { useState, useEffect } from 'react';
export const TypewriterText = ({ text, delay = 25, animate = false }: { text: string, delay?: number, animate?: boolean }) => {
  const [displayedText, setDisplayedText] = useState(animate ? "" : text);

  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      return;
    }
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [text, animate, delay]);

  return <span>{displayedText}</span>;
};

