'use client';

import { useContext } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import Input from '@/components/Input';

import { CanvasGlobalContext } from '@/contexts/canvas';

import { inp_to_ndc, user_to_ndc, ndc_to_dc } from '@/functions/canvas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { z } from 'zod';

import { PaintBrushIcon, TrashIcon } from '@heroicons/react/24/solid';

const PositionFormSchema = z.object({
  posX: z.coerce
    .number()
    .min(-400, 'Valor mínimo: -400')
    .max(400, 'Valor máximo: 400'),
  posY: z.coerce
    .number()
    .min(-300, 'Valor mínimo: -300')
    .max(300, 'Valor máximo: 300')
});

type PositionFormData = z.infer<typeof PositionFormSchema>;

function Pixel() {
  const canvasContext = useContext(CanvasGlobalContext);
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<PositionFormData>({
    resolver: zodResolver(PositionFormSchema)
  });

  function handleClick({ posX, posY }: PositionFormData) {
    canvasContext
      ?.drawPixel(posX, posY)
      .then(() => {
        enqueueSnackbar('O pixel foi desenhado.', { variant: 'success' });
      })
      .catch((e) => {
        enqueueSnackbar(`${e}`, { variant: 'error' });
      });
  }

  return (
    <div>
      <span className="text-3xl mb-2">Desenhar Pixel</span>
      <hr className="h-px bg-gray-100 border-0 mb-4 mt-2" />
      <form
        className="flex flex-col gap-2 items-center"
        onSubmit={handleSubmit(handleClick)}
      >
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            placeholder="Ponto X"
            type="number"
            step="any"
            required
            {...register('posX')}
            error={errors.posX}
          />
          <Input
            placeholder="Ponto Y"
            type="number"
            step="any"
            required
            {...register('posY')}
            error={errors.posY}
          />
        </div>
        <div className="flex gap-2">
          <Button
            name="Desenhar"
            type="submit"
            icon={<PaintBrushIcon className="w-6 h-6 mr-3" />}
            color="bg-blue-500"
            hover="hover:bg-blue-600"
          />
          <Button
            name="Limpar"
            type="button"
            icon={<TrashIcon className="w-6 h-6 mr-3" />}
            color="bg-emerald-500"
            hover="hover:bg-emerald-600"
            onClick={() => {
              canvasContext
                ?.clearCanvas()
                .then(() =>
                  enqueueSnackbar('O display foi limpo.', {
                    variant: 'info'
                  })
                )
                .catch((error) =>
                  enqueueSnackbar(`${error}`, { variant: 'error' })
                );
            }}
          />
        </div>
      </form>
      <div className="mt-2">
        {getValues().posX && getValues().posY && (
          <div className="mt-3">
            <div className="flex flex-col">
              <span>
                INP para NDC:{' '}
                {inp_to_ndc([getValues().posX, getValues().posY])
                  .map((p: number) => p.toFixed(2))
                  .join(', ')}
              </span>
              <span>
                User para NDC:{' '}
                {user_to_ndc(getValues().posX, getValues().posY).join(', ')}
              </span>
              <span>
                NDC para DC:{' '}
                {ndc_to_dc(getValues().posX, getValues().posY).join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pixel;
