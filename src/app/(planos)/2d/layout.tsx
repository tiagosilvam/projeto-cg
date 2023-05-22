'use client';

import Loading from '@/components/LoadingSpin';

import CanvasProvider from '@/contexts/Canvas';

import dynamic from 'next/dynamic';

export default function Figuras2DLayout({
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
      <div className="flex flex-col bg-white p-4 rounded shadow-sm w-96">
        <div className="flex flex-col justify-evenly gap-2">
          <CanvasProvider>{children}</CanvasProvider>
        </div>
      </div>
    </div>
  );
}
