import { useState, useEffect, useRef } from "react";

type Props = {
  targetText: string;
  textSize: string;
};

export default function TypingHighlighter({ targetText, textSize }: Props) {
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        containerRef.current.blur(); // Remove focus when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Ensure auto-focus happens only if nothing else is focused
    if (containerRef.current && document.activeElement === document.body) {
      containerRef.current.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key.length === 1 && input.length < targetText.length) {
      setInput((prev) => prev + e.key);
    } else if (e.key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex space-x-1 outline-none cursor-default"
      style={{ fontSize: textSize }}
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      {targetText.split("").map((char, index) => {
        let color = "text-foreground/40";
        if (index < input.length) {
          color = input[index] === char ? "text-foreground" : "text-red-500";
        }
        return (
          <span key={index} className={color}>
            {char}
          </span>
        );
      })}
    </div>
  );
}
