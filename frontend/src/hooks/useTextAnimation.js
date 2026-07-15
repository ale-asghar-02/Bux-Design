import { useState, useRef, useEffect } from "react";

/**
 * Sirf heading/text ko animate karta hai - scroll trigger (IntersectionObserver) ke bina.
 * Component mount hote hi animation start ho jata hai.
 *
 * headingText: string (jo text animate karna hai)
 */
export function useHeadingAnimation(headingText, charDelay = 60) {
  const [headingAnimate, setHeadingAnimate] = useState(false);

  useEffect(() => {
    // chota delay taake animation page load ke baad smoothly start ho
    const timer = setTimeout(() => {
      setHeadingAnimate(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // text ko words mein split karo, har word ke characters ka
  // delay uske poore text mein position ke hisab se nikalo
  const words = [];
  let cursor = 0;

  headingText.split(" ").forEach((wordText) => {
    const chars = wordText.split("").map((char, i) => ({
      char,
      delay: (cursor + i) * charDelay,
    }));
    cursor += wordText.length + 1; // +1 space ke liye, taake delay continuous rahe
    words.push(chars);
  });

  return { headingAnimate, words };
}

/**
 * Text + image segments ke liye - scroll mein aane par (IntersectionObserver) animate hota hai.
 *
 * textAnimation: Array of objects
 *   { type: "text", value: "some string" }
 *   { type: "image", src: "path/to/img.svg", alt: "" }
 */
export function useTextAnimation(textAnimation, charDelay = 60) {
  const [textAnimate, setTextAnimate] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTextAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const timer = setTimeout(() => {
      if (textRef.current) observer.observe(textRef.current);
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Har segment ka delay calculate karo sequentially
  let cursor = 0;
  const processed = textAnimation.map((seg) => {
    if (seg.type === "text") {
      const chars = seg.value.split("").map((char, i) => ({
        char,
        delay: (cursor + i) * charDelay,
      }));
      cursor += seg.value.length;
      return { ...seg, chars };
    } else {
      // image
      const delay = cursor * charDelay;
      cursor += 1; // image = 1 slot
      return { ...seg, delay };
    }
  });

  return { textRef, textAnimate, processed };
}