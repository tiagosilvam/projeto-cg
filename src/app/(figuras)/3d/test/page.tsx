'use client';

import { useContext } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { Form } from '@/components/Form';

import { CanvasGlobalContext } from '@/contexts/canvas';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createUserSchema = z.object({
  posX: z.coerce
    .number()
    .min(-400, 'Valor mínimo: -400')
    .max(400, 'Valor máximo: 400'),
  posY: z.coerce
    .number()
    .min(-300, 'Valor mínimo: -300')
    .max(300, 'Valor máximo: 300')
});

type CreateUserData = z.infer<typeof createUserSchema>;

function Test() {
  const createUserForm = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema)
  });

  async function createUser(data: CreateUserData) {
    console.log(data);
  }

  const context = useContext(CanvasGlobalContext);

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = createUserForm;

  return (
    <main className="flex flex-row gap-6 items-center justify-center">
      <FormProvider {...createUserForm}>
        <form
          onSubmit={handleSubmit(createUser)}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-4">
            <Form.Field>
              <Form.Input
                type="number"
                name="posX"
                placeholder="posX"
                required
              />
              <Form.ErrorMessage field="posX" />
            </Form.Field>
            <Form.Field>
              <Form.Input
                type="number"
                name="posY"
                placeholder="posY"
                required
              />
              <Form.ErrorMessage field="posY" />
            </Form.Field>
          </div>
          <div className="flex gap-4">
            <Form.Field>
              <Form.Input
                type="number"
                name="posX"
                placeholder="posX2"
                required
              />
              <Form.ErrorMessage field="posX" />
            </Form.Field>
            <Form.Field>
              <Form.Input
                type="number"
                name="posY"
                placeholder="posY2"
                required
              />
              <Form.ErrorMessage field="posY" />
            </Form.Field>
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-violet-500 text-white rounded px-3 h-10 font-semibold text-sm hover:bg-violet-600"
            >
              Salvar
            </button>
          </div>
        </form>
        <button>DESENHSAR</button>
      </FormProvider>
    </main>
  );
}

export default Test