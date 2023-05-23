'use client';

import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import Input from '@/components/Input';
import { RadioButton } from '@/components/RadioButton';

import { CanvasGlobalContext } from '@/contexts/canvas';

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
  const [pontos, setPontos] = useState<number[][]>();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PositionFormData>({
    resolver: zodResolver(PositionFormSchema)
  });

  async function handleClick({ posX, posY, posX2, posY2 }: PositionFormData) {
    if (pontos) setPontos([]);
    canvasContext
      ?.desenharReta(posX, posY, posX2, posY2, value)
      .then((result) => {
        console.log(result);
      })
      .then(() =>
        enqueueSnackbar(`A reta foi desenhada usando o algorítmo ${value}.`, {
          variant: 'success'
        })
      )
      .then(() => console.log(pontos))
      .catch((error) =>
        enqueueSnackbar(`${error}`, {
          variant: 'error'
        })
      );
  }

  return (
    <div className="">
      <span className="text-3xl mb-2">Desenhar Reta</span>
      <hr className="h-px bg-gray-100 border-0 mb-4 mt-2" />
      <div className="flex flex-row gap-3 mb-4">
        <RadioButton
          name="Reta"
          label="DDA"
          onClick={() => setValue('DDA')}
          defaultChecked
        />
        <RadioButton
          name="Reta"
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
    </div>
  );
}

export default Reta;
