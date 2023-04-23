'use client';

import { useContext } from 'react';

import { Button } from '@/components/Button';

import { CanvasGlobalContext } from '@/contexts/Canvas';

import { useSnackbar } from 'notistack';

import { PaintBrushIcon } from '@heroicons/react/24/solid';

function Pixel() {
  const canvasContext = useContext(CanvasGlobalContext);
  const { enqueueSnackbar } = useSnackbar();

  function handleClick() {
    canvasContext
      ?.cube()
      .then(() => {
        enqueueSnackbar('O cubo foi desenhado.', { variant: 'success' });
      })
      .catch((e) => {
        enqueueSnackbar(`${e}`, { variant: 'error' });
      });
  }

  return (
    <div>
      <span className="text-3xl mb-2">Desenhar Pixel</span>
      <hr className="h-px bg-gray-100 border-0 mb-4 mt-2" />
      <Button
        name="Limpar"
        type="button"
        icon={<PaintBrushIcon className="w-6 h-6 mr-3" />}
        color="bg-emerald-500"
        hover="hover:bg-emerald-600"
        onClick={handleClick}
      />
    </div>
  );
}

export default Pixel;
