import type { ReactNode } from 'react';
import { Link } from 'react-router';

export function Note({ children }: { children: ReactNode }) {
  return <div className="doc-note">{children}</div>;
}

/** In-docs link that routes without a reload. */
export function A({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={to}>{children}</Link>;
}
