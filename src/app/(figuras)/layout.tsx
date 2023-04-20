'use client';

import { useEffect, useRef, useState } from 'react';

import AlertProvider from '@/components/Alert/Alert';
import { Canvas } from '@/components/Canvas';

import CanvasGlobalContextProvider from '@/contexts/canvas';

export default function FigurasLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    setCanvasContext(context);
  }, [canvasRef]);

  return (
    <div className="flex justify-evenly items-center w-full">
      <div className="bg-white p-2 rounded shadow-sm">
        <Canvas refCanvas={canvasRef} />
      </div>
      <div className="flex flex-col justify-evenly">
        <div className="flex flex-col justify-evenly gap-5">
          <CanvasGlobalContextProvider ctx={canvasContext}>
            <AlertProvider>{children}</AlertProvider>
          </CanvasGlobalContextProvider>
        </div>
      </div>
    </div>
  );
}
