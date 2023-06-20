/* eslint-disable indent */
'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import Input from '@/components/Input';
import Loading from '@/components/LoadingSpin';
import { RadioButton } from '@/components/RadioButton';

import {
  getMatrizTransform,
  generateForm,
  desenharRetaDDA
} from '@/functions/canvas3d';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import p5Types from 'p5';
import { z } from 'zod';

import { CheckIcon, TrashIcon } from '@heroicons/react/24/solid';

const Canvas = dynamic(
  () => import('@/components/Sketch').then((component) => component.default),
  {
    ssr: false,
    loading: () => <Loading />
  }
);

type Forma = {
  vertices: number[][];
  lados: number[][];
};

const PositionFormSchema = z.object({
  size: z.coerce.number(),
  data: z.array(
    z.object({
      x: z.coerce.number().optional(),
      y: z.coerce.number().optional(),
      z: z.coerce.number().optional(),
      fator: z.coerce
        .number()
        .min(0, 'O valor mínimo é 0.')
        .max(3, 'O valor máximo é 3.')
        .optional(),
      position: z.string().optional(),
      rotacao: z.coerce
        .number()
        .min(0, 'O valor mínimo é de 0°.')
        .max(360, 'O valor máximo é de 360°.')
        .optional()
    })
  ),
  forma: z.string().nonempty()
});

type PositionFormData = z.infer<typeof PositionFormSchema>;

export default function Page() {
  const [forma, setForma] = useState<Forma>();
  const [operacao, setOperacao] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    resetField
  } = useForm<PositionFormData>({
    resolver: zodResolver(PositionFormSchema)
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'data'
  });

  function getInput() {
    switch (operacao) {
      case 'translacao': {
        return fields.map((field, i) => {
          return (
            <div key={field.id} className="flex space-x-2">
              <Input
                placeholder="Valor de X"
                type="number"
                step="any"
                required
                {...register(`data.${i}.x`)}
                error={errors.data?.[i]?.x}
              />
              <Input
                placeholder="Valor de Y"
                type="number"
                step="any"
                required
                {...register(`data.${i}.y`)}
                error={errors.data?.[i]?.y}
              />
              <Input
                placeholder="Valor de Z"
                type="number"
                step="any"
                required
                {...register(`data.${i}.z`)}
                error={errors.data?.[i]?.z}
              />
            </div>
          );
        });
      }
      case 'escala': {
        return fields.map((field, i) => {
          return (
            <div key={field.id}>
              <Input
                placeholder="Fator de escala"
                type="number"
                step="any"
                required
                {...register(`data.${i}.fator`)}
                error={errors.data?.[i]?.fator}
              />
            </div>
          );
        });
      }
      case 'rotacao': {
        return (
          <div>
            <div className="flex mb-4 space-x-4">
              <RadioButton
                name="Local"
                label="Em torno de X"
                onClick={() => replace({ position: 'x' })}
              />
              <RadioButton
                name="Local"
                label="Em torno de Y"
                onClick={() => replace({ position: 'y' })}
              />
              <RadioButton
                name="Local"
                label="Em torno de Z"
                onClick={() => replace({ position: 'z' })}
              />
            </div>
            <div>
              {fields.map((field, i) => {
                return (
                  <div key={field.id}>
                    {field.position && (
                      <Input
                        placeholder="Valor em graus"
                        type="number"
                        step="any"
                        required
                        {...register(`data.${i}.rotacao`)}
                        error={errors.data?.[i]?.rotacao}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      case 'cisalhamento': {
        return (
          <div className="flex flex-col justify-center items-center w-96">
            <div className="flex mb-4 space-x-4">
              <RadioButton
                name="Local"
                label="Em YZ"
                onClick={() => replace({ position: 'x' })}
              />
              <RadioButton
                name="Local"
                label="Em XZ"
                onClick={() => replace({ position: 'y' })}
              />
              <RadioButton
                name="Local"
                label="Em XY"
                onClick={() => replace({ position: 'z' })}
              />
            </div>
            {fields.map((field, i) => {
              return (
                <div key={field.id} className="flex space-x-4">
                  {field.position && field.position !== 'x' && (
                    <Input
                      placeholder="Valor de X"
                      type="number"
                      step="any"
                      required
                      {...register(`data.${i}.x`)}
                      error={errors.data?.[i]?.x}
                    />
                  )}
                  {field.position && field.position !== 'y' && (
                    <Input
                      placeholder="Valor de Y"
                      type="number"
                      step="any"
                      required
                      {...register(`data.${i}.y`)}
                      error={errors.data?.[i]?.y}
                    />
                  )}
                  {field.position && field.position !== 'z' && (
                    <Input
                      placeholder="Valor de Z"
                      type="number"
                      step="any"
                      required
                      {...register(`data.${i}.z`)}
                      error={errors.data?.[i]?.z}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      }
      case 'reflexao': {
        return (
          <div className="flex mb-4 space-x-4">
            <RadioButton
              name="Local"
              label="Em torno de X"
              onClick={() => replace({ position: 'x' })}
            />
            <RadioButton
              name="Local"
              label="Em torno de Y"
              onClick={() => replace({ position: 'y' })}
            />
            <RadioButton
              name="Local"
              label="Em torno de Z"
              onClick={() => replace({ position: 'z' })}
            />
          </div>
        );
      }
    }
  }

  async function handleClick({ data }: PositionFormData) {
    if (forma && operacao) {
      return await getMatrizTransform(operacao, data)
        .then((matriz) => {
          setForma({
            vertices: multiplyMatrices(forma.vertices, matriz),
            lados: forma.lados
          });

          enqueueSnackbar('A transformação efetuada com sucesso!', {
            variant: 'success'
          });
        })
        .catch(() =>
          enqueueSnackbar('Selecione a reta.', { variant: 'warning' })
        );
    }
    enqueueSnackbar('Selecione uma transformacão.', { variant: 'error' });
  }

  function clear() {
    setForma(undefined);
    setOperacao('');
    setValue('forma', 'Selecione uma forma');
    resetField('size');
    enqueueSnackbar('O display foi limpo.', { variant: 'info' });
  }

  function multiplyMatrices(vertices: number[][], transformacao: number[][]) {
    const result: number[][] = [];
    for (let i = 0; i < vertices.length; i++) {
      result[i] = [];
      for (let j = 0; j < transformacao[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < transformacao.length; k++) {
          sum += vertices[i][k] * transformacao[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  function draw(p5: p5Types) {
    p5.background(0);
    p5.orbitControl(2);

    if (forma) {
      for (let i = 0; i < forma.lados.length; i++) {
        const v1 = forma.vertices[forma.lados[i][0]];
        const v2 = forma.vertices[forma.lados[i][1]];
        desenharRetaDDA(p5, v1[0], v1[1], v1[2], v2[0], v2[1], v2[2]);
      }
    }
  }

  return (
    <div className="flex justify-evenly items-center w-full">
      <div className="flex items-end space-x-4">
        <div className="flex justify-center items-center bg-white w-[810px] h-[610px] rounded shadow-sm">
          <Canvas draw={draw} />
        </div>
        <div className="bg-white rounded shadow-sm p-4 flex flex-col">
          <div className="flex items-center">
            <hr className="w-10 mr-4 border-red-500 border-2" />
            <span> Eixo X</span>
          </div>
          <div className="flex items-center">
            <hr className="w-10 mr-4 border-green-500 border-2" />
            <span> Eixo Y</span>
          </div>
          <div className="flex items-center">
            <hr className="w-10 mr-4 border-blue-700 border-2" />
            <span> Eixo Z</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-white p-4 rounded shadow-sm w-[420px]">
        <span className="text-3xl mb-2">Formas 3D</span>
        <hr className="h-px bg-gray-100 border-0 mb-4" />
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit(handleClick)}
        >
          <div className="flex flex-col">
            <div className="flex space-x-4 justify-center">
              <Input
                placeholder="Tamanho da forma"
                type="number"
                step="any"
                {...register('size')}
                error={errors.size}
              />
              <select
                className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 h-10 bg-transparent"
                defaultValue="Selecione uma figura"
                {...register('forma')}
                onChange={(e: any) =>
                  setForma(
                    generateForm(e.currentTarget.value, getValues('size'))
                  )
                }
              >
                <option>Selecione uma forma</option>
                <option value="quadrado">Quadrado</option>
                <option value="triangulo">Triângulo</option>
                <option value="retangulo">Retângulo</option>
              </select>
            </div>
            <select
              className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-zinc-200 disabled:bg-zinc-100 bg-transparent"
              defaultValue="Selecione uma transformação"
              onChange={(e) => {
                setOperacao(e.currentTarget.value);
                replace({
                  x: undefined,
                  y: undefined,
                  z: undefined,
                  fator: undefined,
                  rotacao: undefined,
                  position: undefined
                });
              }}
              disabled={forma == null}
            >
              <option>Selecione uma transformação</option>
              <option value="translacao">Translação</option>
              <option value="escala">Escala</option>
              <option value="rotacao">Rotacão</option>
              <option value="cisalhamento">Cisalhamento</option>
              <option value="reflexao">Reflexão</option>
            </select>
          </div>
          <div className="mt-4">{getInput()}</div>
          <div className="flex space-x-4">
            <Button
              name="Transformar"
              type="submit"
              color="bg-blue-500"
              hover="hover:bg-blue-600"
              icon={<CheckIcon className="w-6 h-6 mr-3" />}
            />
            <Button
              name="Limpar tela"
              color="bg-emerald-500"
              type="button"
              hover="hover:bg-emerald-600"
              onClick={() => clear()}
              icon={<TrashIcon className="w-6 h-6 mr-3" />}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
