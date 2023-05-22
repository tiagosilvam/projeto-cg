import React, { FC } from 'react';
import Sketch from 'react-p5';

import p5Types from 'p5'; //Import this for typechecking and intellisense

const CanvasNew: FC<any> = ({ draw }) => {
  function setup(p5: p5Types, canvasParentRef: Element) {
    p5.createCanvas(800, 600, p5.WEBGL).parent(canvasParentRef);
    p5.angleMode('degrees');
    p5.debugMode(0, 0, 0, 0, 0, -150, 0, 0, 0);
    p5.camera(-200, -200, -200);
  }

  return <Sketch setup={setup} draw={draw} />;
};

export default CanvasNew;
