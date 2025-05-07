// src/components/MswInitializer.tsx
'use client'

import { useEffect } from 'react'

export function MswInitializer() {
  useEffect(() => {
    const initMsw = async () => {
      if (process.env.NEXT_PUBLIC_API_ENV === 'mock') {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
      }
    };
    
    initMsw();
  }, []);

  return null; // UI를 렌더링하지 않는 컴포넌트
}