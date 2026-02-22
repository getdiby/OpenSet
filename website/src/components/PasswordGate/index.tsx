import React, { useCallback, useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const STORAGE_KEY = 'openset_gate_unlocked';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const { siteConfig } = useDocusaurusContext();
  const gatePassword = (siteConfig.customFields?.gatePassword as string) ?? '';

  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !gatePassword) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === gatePassword) {
        setUnlocked(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, [mounted, gatePassword]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (password === gatePassword) {
        try {
          localStorage.setItem(STORAGE_KEY, gatePassword);
          setUnlocked(true);
        } catch {
          setError('Could not save unlock state.');
        }
      } else {
        setError('Incorrect password.');
      }
    },
    [password, gatePassword]
  );

  // Gate disabled: no password configured
  if (!gatePassword) {
    return <>{children}</>;
  }

  // Wait for client mount so we can read localStorage without hydration mismatch
  if (!mounted) {
    return (
      <div className="password-gate password-gate--loading">
        <p>Loading…</p>
      </div>
    );
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="password-gate">
      <div className="password-gate__card">
        <h1 className="password-gate__title">OpenSet</h1>
        <p className="password-gate__hint">Enter the password to view this site.</p>
        <form className="password-gate__form" onSubmit={onSubmit}>
          <input
            type="password"
            className="password-gate__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            autoComplete="current-password"
            aria-label="Password"
          />
          <button type="submit" className="password-gate__button">
            Enter
          </button>
        </form>
        {error && <p className="password-gate__error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
