'use client';

import { useEffect } from 'react';

import p5 from 'p5';

import { sketch } from './sketch';

export default function Test() {
  useEffect(() => {
    new p5(sketch);
  }, []);

  return <div id="sketch-container"></div>;
}
