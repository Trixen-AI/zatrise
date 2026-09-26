import { Link } from 'react-router';
import { Empty, PageHeader } from '@/app/ui/kit';

export default function AppNotFound() {
  return (
    <>
      <PageHeader eyebrow="404" title="Page not found" />
      <Empty title="This page is not part of the app" action={<Link to="/app" className="btn btn-primary">Go to overview</Link>} />
    </>
  );
}
