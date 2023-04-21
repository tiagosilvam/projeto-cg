'use client';

import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Grow from '@/components/Alert/transition';
import { Button } from '@/components/Button';
import Input from '@/components/Input';
import { RadioButton } from '@/components/RadioButton';

import { CanvasGlobalContext } from '@/contexts/canvas';

import { zodResolver } from '@hookform/resolvers/zod';
import { closeSnackbar, useSnackbar } from 'notistack';
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
    .max(300, 'Valor máximo: 300'),
  posX2: z.coerce
    .number()
    .min(-400, 'Valor mínimo: -400')
    .max(400, 'Valor máximo: 400'),
  posY2: z.coerce
    .number()
    .min(-300, 'Valor mínimo: -300')
    .max(300, 'Valor máximo: 300')
});

type PositionFormData = z.infer<typeof PositionFormSchema>;

function Reta() {
  const canvasContext = useContext(CanvasGlobalContext);
  const [value, setValue] = useState('DDA');
  const { enqueueSnackbar } = useSnackbar();

  const [pontos, setPontos] = useState<number[][]>();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PositionFormData>({
    resolver: zodResolver(PositionFormSchema)
  });

  useEffect(() => {
    if (pontos) {
      enqueueSnackbar(
        <div className="w-44 text-gray-900 flex flex-col items-center">
          <label className="block mb-2 text-sm">Pontos</label>
          <select
            multiple
            disabled
            className="h-20 text-center bg-gray-50 border border-zinc-300 text-sm rounded-lg w-full p-2"
          >
            {pontos.map(([x, y]: Array<number>, index) => (
              <option
                className="hover:bg-zinc-100 hover:text-blue-500"
                key={index}
              >
                {x.toFixed()}, {y.toFixed()}
              </option>
            ))}
          </select>
        </div>,
        {
          variant: 'default',
          TransitionComponent: Grow,
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          autoHideDuration: 10000,
          preventDuplicate: true,
          key: 'barPoints'
        }
      );
    }
  }, [pontos, enqueueSnackbar]);

  async function handleClick({ posX, posY, posX2, posY2 }: PositionFormData) {
    if (pontos) setPontos([]);
    value === 'DDA'
      ? setPontos(canvasContext?.desenharRetaDDA(posX, posY, posX2, posY2))
      : setPontos(canvasContext?.desenharRetaPM(posX, posY, posX2, posY2));
    enqueueSnackbar(`Desenhado usando o algorimo ${value}.`, {
      variant: 'success'
    });
  }

  return (
    <div className="flex flex-col bg-white p-4 rounded shadow-sm w-96">
      <span className="text-3xl mb-2">Desenhar Reta</span>
      <hr className="h-px bg-gray-100 border-0 mb-4" />
      <div className="flex flex-row gap-3 mb-4">
        <RadioButton
          name="Radio"
          label="DDA"
          onClick={() => setValue('DDA')}
          defaultChecked
        />
        <RadioButton
          name="Radio"
          label="Ponto médio"
          onClick={() => setValue('ponto médio')}
        />
      </div>
      <hr className="h-px bg-gray-100 border-0 mb-4" />
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
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            placeholder="Ponto X2"
            type="number"
            step="any"
            required
            {...register('posX2')}
            error={errors.posX2}
          />
          <Input
            placeholder="Ponto Y2"
            type="number"
            step="any"
            required
            {...register('posY2')}
            error={errors.posY2}
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
              canvasContext?.clearCanvas();
              enqueueSnackbar('O display foi limpo.', { variant: 'info' });
              closeSnackbar('barPoints');
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default Reta