/* eslint-disable indent */
'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import AlertProvider from '@/components/Alert/Alert';
import { Button } from '@/components/Button';
import Input from '@/components/Input';
import Loading from '@/components/LoadingSpin';
import { RadioButton } from '@/components/RadioButton';

import { getMatrizTransform } from '@/functions/canvas';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import p5Types from 'p5';
import { z } from 'zod';

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
  data: z.array(
    z.object({
      x: z.coerce.number().optional(),
      y: z.coerce.number().optional(),
      z: z.coerce.number().optional(),
      fator: z.coerce.number().min(0, 'min 0').max(3, 'max 3').optional(),
      position: z.string().optional(),
      rotacao: z.coerce.number().optional()
    })
  )
});

type PositionFormData = z.infer<typeof PositionFormSchema>;

export default function Page() {
  const [size, setSize] = useState<number>(0);
  const [forma, setForma] = useState<Forma>();
  const [operacao, setOperacao] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<PositionFormData>({
    resolver: zodResolver(PositionFormSchema)
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'data'
  });

  const formas = {
    quadrado: {
      nome: 'Quadrado',
      vertices: [
        [0, 0, 0, 1],
        [-size, 0, 0, 1],
        [-size, -size, 0, 1],
        [0, -size, 0, 1],
        [0, 0, -size, 1],
        [-size, 0, -size, 1],
        [-size, -size, -size, 1],
        [0, -size, -size, 1]
      ],
      lados: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7]
      ]
    },
    triangulo: {
      nome: 'Triangulo',
      vertices: [
        [0, 0, 0, 1],
        [-size, 0, 0, 1],
        [0, -size, 0, 1],
        [0, 0, -size, 1]
      ],
      lados: [
        [0, 1],
        [1, 2],
        [2, 0],
        [0, 3],
        [1, 3],
        [2, 3]
      ]
    },
    paralelepipedo: {
      nome: 'Paralelepipedo',
      vertices: [
        [0, 0, 0, 1],
        [-size * 1.5, 0, 0, 1],
        [-size * 1.5, -size, 0, 1],
        [0, -size, 0, 1],
        [0, 0, -size, 1],
        [-size * 1.5, 0, -size, 1],
        [-size * 1.5, -size, -size, 1],
        [0, -size, -size, 1]
      ],
      lados: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7]
      ]
    }
  };

  function getInput() {
    switch (operacao) {
      case 'translacao': {
        return fields.map((field, i) => {
          return (
            <div key={field.id}>
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
            <div>
              <RadioButton
                name="Local"
                label="Em torno de X"
                onClick={() => replace({ position: 'x' })}
                defaultChecked
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
            {fields.map((field, i) => {
              return (
                <div key={field.id}>
                  <Input
                    placeholder="Valor em graus"
                    type="number"
                    step="any"
                    required
                    {...register(`data.${i}.rotacao`)}
                    error={errors.data?.[i]?.rotacao}
                  />
                </div>
              );
            })}
          </div>
        );
      }
      case 'cisalhamento': {
        return (
          <div>
            <div>
              <RadioButton
                name="Local"
                label="Em torno de X"
                onClick={() => replace({ position: 'x' })}
                defaultChecked
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
            {fields.map((field, i) => {
              return (
                <div key={field.id}>
                  {field.position !== 'x' && (
                    <Input
                      placeholder="Valor de X"
                      type="number"
                      step="any"
                      required
                      {...register(`data.${i}.x`)}
                      error={errors.data?.[i]?.x}
                    />
                  )}
                  {field.position !== 'y' && (
                    <Input
                      placeholder="Valor de Y"
                      type="number"
                      step="any"
                      required
                      {...register(`data.${i}.y`)}
                      error={errors.data?.[i]?.y}
                    />
                  )}
                  {field.position !== 'z' && (
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
          <div>
            <RadioButton
              name="Local"
              label="Em torno de X"
              onClick={() => replace({ position: 'x' })}
              defaultChecked
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

  async function handleClick(data: PositionFormData) {
    console.log(data)
    if (forma) {
      getMatrizTransform(operacao, data)
        .then((matriz) => {
          setForma({
            vertices: multiplyMatrices(forma.vertices, matriz),
            lados: forma.lados
          });
        })
        .catch((e) => console.log(e));
    }
    enqueueSnackbar('O círculo foi desenhado.', { variant: 'success' });
  }

  function clear() {
    setForma(undefined);
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
        p5.stroke('orange');
        p5.line(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2]);
      }
    }
  }

  return (
    <AlertProvider>
      <div className="flex justify-evenly items-center w-full">
        <div className="flex items-center justify-center bg-white w-[810px] h-[610px] rounded shadow-sm">
          <Canvas draw={draw} />
        </div>
        <div className="flex flex-col bg-white p-4 rounded shadow-sm w-96 gap-4">
          <div className="flex space-x-2">
            <input
              className="border-gray-200 text-sm rounded-lg hover:bg-gray-50 block w-72 p-2.5 bg-transparent"
              placeholder="Tamanho da figura"
              onChange={(e) => setSize(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <select disabled={size == 0} defaultValue="Selecione uma figura">
              <option>Selecione uma figura</option>
              {Object.values(formas).map((e, i) => (
                <option onClick={() => setForma(e)} key={i}>
                  {e.nome}
                </option>
              ))}
            </select>
            <select
              disabled={forma == null}
              defaultValue="Selecione uma transformação"
              onClick={(e) => {
                setOperacao(e.currentTarget.value);
              }}
            >
              <option value={''}>Selecione uma transformação</option>
              <option
                value="translacao"
                onClick={() =>
                  replace({ x: undefined, y: undefined, z: undefined })
                }
              >
                Translação
              </option>
              <option
                value="escala"
                onClick={() =>
                  replace({
                    fator: undefined
                  })
                }
              >
                Escala
              </option>
              <option
                value="rotacao"
                onClick={() => replace({ rotacao: undefined, position: 'x' })}
              >
                Rotacão
              </option>
              <option
                value="cisalhamento"
                onClick={() =>
                  replace({
                    x: undefined,
                    y: undefined,
                    z: undefined,
                    position: 'x'
                  })
                }
              >
                Cisalhamento
              </option>
              <option
                value="reflexao"
                onClick={() => replace({ position: 'x' })}
              >
                Reflexão
              </option>
            </select>
          </div>
          <form
            className="flex flex-col gap-2 items-center"
            onSubmit={handleSubmit(handleClick)}
          >
            <div>{getInput()}</div>
            <Button
              name="Aplicar transformação"
              type="submit"
              color="bg-blue-500"
              hover="hover:bg-blue-600"
            />
            <Button
              name="Limpar tela"
              color="bg-blue-500"
              hover="hover:bg-blue-600"
              onClick={() => clear()}
            />
          </form>
        </div>
      </div>
    </AlertProvider>
  );
}
