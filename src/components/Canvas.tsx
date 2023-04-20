import { LegacyRef, useEffect, useState } from 'react';

export const Canvas = ({
  refCanvas
}: {
  refCanvas: LegacyRef<HTMLCanvasElement>;
}) => {
  const [color, setColor] = useState<string | null>();

  useEffect(() => {
    setColor(localStorage.getItem('bg-canvas-color'));
  }, [setColor]);

  return (
    <canvas
      id="canvas"
      ref={refCanvas}
      width="800"
      height="600"
      style={{ backgroundColor: `${color ? color : 'black'}` }}
    />
  );
};
