import { useEffect, useState } from 'react';

export default function Canvas() {
  const [color, setColor] = useState<string | null>('black');

  useEffect(() => {
    setColor(localStorage.getItem('bg-canvas-color'));
  }, [setColor]);

  return (
    <canvas
      id="canvas"
      width="800"
      height="600"
      style={{ backgroundColor: `${color}` }}
    />
  );
}
