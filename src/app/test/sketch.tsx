import p5 from 'p5';

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400, p.WEBGL);
  };

  p.draw = () => {
    p.background(0);
    p.box(50);
    p.orbitControl(2);
    p.rotateX(45);
  };
};
