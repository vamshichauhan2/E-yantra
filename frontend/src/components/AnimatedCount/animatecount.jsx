// AnimatedCount.jsx
import React, { useState, useEffect } from 'react';

function AnimatedCount({ targetCount }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetCount;
    if (start === end) return;

    const duration = 1000;  // animation duration in milliseconds
    const incrementTime = 50; // how often to increment count

    const steps = Math.ceil(duration / incrementTime);
    const increment = Math.ceil(end / steps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [targetCount]);

  return <h2>{count}</h2>;
}

export default AnimatedCount;
