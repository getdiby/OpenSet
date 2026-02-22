import React from 'react';
import PasswordGate from '@site/src/components/PasswordGate';

export default function Root({ children }: { children: React.ReactNode }) {
  return <PasswordGate>{children}</PasswordGate>;
}
