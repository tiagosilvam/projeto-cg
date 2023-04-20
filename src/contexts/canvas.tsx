import { createContext } from 'react';

import * as CanvasFunctions from '@/functions/canvas';

type ContextProps = {
  setPixel: (x: number, y: number) => void;
  desenharRetaDDA: (x: number, y: number, x2: number, y2: number) => number[][];
  desenharRetaPM: (x: number, y: number, x2: number, y2: number) => number[][];
  desenharPontoMedioCirculo: (r: number) => void;
  clearCanvas: () => void;
  inp_to_ndc: ([x, y]: [x: number, y: number]) => number[];
  user_to_ndc: (x: number, y: number) => number[];
  ndc_to_dc: (x: number, y: number) => number[];
  getCtx: () => void;
};

export const CanvasGlobalContext = createContext<ContextProps | null>(null);

export const CanvasGlobalContextProvider = ({
  children,
  ctx
}: {
  children: React.ReactNode;
  ctx: any;
}) => {
  // Pixel
  function setPixel(x: number, y: number) {
    CanvasFunctions.setPixel(ctx, x, y);
  }

  // Reta
  function desenharRetaDDA(x: number, y: number, x2: number, y2: number) {
    CanvasFunctions.setLines(ctx);
    return CanvasFunctions.desenharRetaDDA(ctx, x, y, x2, y2);
  }

  function desenharRetaPM(x: number, y: number, x2: number, y2: number) {
    CanvasFunctions.setLines(ctx);
    return CanvasFunctions.desenharRetaPM(ctx, x, y, x2, y2);
  }

  // Circulo
  function desenharPontoMedioCirculo(raio: number) {
    CanvasFunctions.setLines(ctx);
    return CanvasFunctions.desenharPontoMedioCirculo(ctx, raio);
  }

  function clearCanvas() {
    CanvasFunctions.clear(ctx);
  }

  // Transformações
  function inp_to_ndc([x, y]: [x: number, y: number]) {
    return CanvasFunctions.inp_to_ndc([x, y]);
  }

  function user_to_ndc(x: number, y: number) {
    return CanvasFunctions.user_to_ndc(x, y);
  }

  function ndc_to_dc(x: number, y: number) {
    return CanvasFunctions.ndc_to_dc(x, y);
  }

  function getCtx() {
    return ctx;
  }

  return (
    <CanvasGlobalContext.Provider
      value={{
        setPixel,
        desenharRetaDDA,
        desenharRetaPM,
        clearCanvas,
        desenharPontoMedioCirculo,
        inp_to_ndc,
        user_to_ndc,
        ndc_to_dc,
        getCtx
      }}
    >
      {children}
    </CanvasGlobalContext.Provider>
  );
};

export default CanvasGlobalContextProvider;
