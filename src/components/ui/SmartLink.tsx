import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router';

type Props = { href: string; className?: string; style?: CSSProperties; children: ReactNode; external?: boolean; onClick?: () => void };

/** Router link for in-app paths ("/app", "/docs/..."), plain anchor for hashes and other sites. */
export function SmartLink({ href, className, style, children, external, onClick }: Props) {
  if (href.startsWith('/') && !external) {
    return (
      <Link to={href} className={className} style={style} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={onClick}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}
