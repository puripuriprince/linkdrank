import React, { useState, useEffect } from "react";

interface TypingMessageProps {
  message: string;
  onComplete: () => void;
}

export const TypingMessage: React.FC<TypingMessageProps> = ({
  message,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(message.slice(0, index + 1));
      index++;
      if (index === message.length) {
        clearInterval(interval);
        setTimeout(() => onComplete(), 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [message, onComplete]);

  return (
    <div className="animate-pulse">
      {displayedText}
      <span className="animate-pulse">|</span>
    </div>
  );
};
