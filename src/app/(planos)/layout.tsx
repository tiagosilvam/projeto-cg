'use client';

import AlertProvider from '@/components/Alert/Alert';

export default function Pages({ children }: { children: React.ReactNode }) {
  return <AlertProvider>{children}</AlertProvider>;
}
