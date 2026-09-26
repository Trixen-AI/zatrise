import { Link } from 'react-router';
import { Logo } from '@/components/brand/Logo';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-[24px] bg-bg px-[20px] text-center">
      <Logo height={36} />
      <p className="t-eyebrow">404</p>
      <h1 className="t-h1">This page is not in the loop</h1>
      <div className="flex flex-wrap justify-center gap-[12px]">
        <Link to="/" className="btn btn-ghost">
          Back to home
        </Link>
        <Link to="/app" className="btn btn-primary">
          Open the app
        </Link>
      </div>
    </main>
  );
}
