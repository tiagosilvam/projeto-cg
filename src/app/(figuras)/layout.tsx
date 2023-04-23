'use client';

import AlertProvider from '@/components/Alert/Alert';
import Loading from '@/components/LoadingSpin';

import dynamic from 'next/dynamic';
import CanvasProvider from '../../contexts/Canvas';

export default function FigurasLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const Canvas = dynamic(() => import('@/components/Canvas'), {
    ssr: false,
    loading: () => <Loading />
  });

  return (
    <div className="flex justify-evenly items-center w-full">
      <div className="flex items-center justify-center bg-white w-[810px] h-[610px] rounded shadow-sm">
        <Canvas />
      </div>
      <div className="flex flex-col bg-white p-4 rounded shadow-sm w-96 justify-evenly">
        <div className="flex flex-col justify-evenly gap-2">
          <CanvasProvider>
            <AlertProvider>{children}</AlertProvider>
          </CanvasProvider>
        </div>
      </div>
    </div>
  );
}
