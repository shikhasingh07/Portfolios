/**
 * useMousePosition — Custom Hook
 *
 * REACT CONCEPTS USED:
 *   - useState  : stores { x, y } normalized mouse coordinates (-0.5 to 0.5)
 *   - useEffect : attaches mousemove listener on mount, removes on unmount
 *                 (prevents memory leaks — always return a cleanup function
 *                  when adding event listeners in useEffect)
 *
 * USAGE:
 *   const { x, y } = useMousePosition();
 *   // x and y are in range [-0.5, 0.5]
 */
import { useState, useEffect } from "react";

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setPosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []); // empty deps → run once on mount

  return position;
};

export default useMousePosition;
