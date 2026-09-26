import { Link, useParams } from 'react-router';
import { useSeo } from '@/lib/seo';
import { DOCS } from './content';

export default function DocPage() {
  const { slug = '' } = useParams();
  const index = DOCS.findIndex((d) => d.slug === slug);
  const doc = DOCS[index];
  const prev = index > 0 ? DOCS[index - 1] : undefined;
  const next = index >= 0 && index < DOCS.length - 1 ? DOCS[index + 1] : undefined;

  useSeo({
    title: doc ? `${doc.title} | Docs` : 'Page not found | Docs',
    description: doc?.summary,
    path: doc ? (doc.slug ? `/docs/${doc.slug}` : '/docs') : `/docs/${slug}`,
  });

  if (!doc) {
    return (
      <article className="max-w-[760px]">
        <p className="t-eyebrow">Docs</p>
        <h1 className="t-h1 mt-[8px]">Page not found</h1>
        <p className="t-body mt-[16px] text-soft">
          That page does not exist. Start from <Link to="/docs" className="text-gold underline">the docs home</Link>.
        </p>
      </article>
    );
  }

  const href = (slugOf: string) => (slugOf ? `/docs/${slugOf}` : '/docs');

  return (
    <article className="max-w-[760px]">
      <p className="t-eyebrow text-[1.6rem] lg:text-[1.8rem]">{doc.group}</p>
      <h1 className="mt-[8px] text-[3.2rem] font-bold leading-120 tracking-[-0.4px] lg:text-[4.4rem]">{doc.title}</h1>
      <p className="mt-[12px] text-[1.8rem] leading-140 text-muted-2">{doc.summary}</p>
      <div className="doc-prose mt-[32px]">{doc.body}</div>

      <nav aria-label="Pager" className="mt-[56px] grid gap-[16px] border-t border-line pt-[32px] sm:grid-cols-2">
        {prev ? (
          <Link to={href(prev.slug)} className="rounded-[16px] border border-white/15 bg-surface p-[20px] transition-colors hover:border-gold">
            <span className="t-small text-muted">Previous</span>
            <span className="t-body-sb mt-[4px] block">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to={href(next.slug)}
            className="rounded-[16px] border border-white/15 bg-surface p-[20px] text-right transition-colors hover:border-gold"
          >
            <span className="t-small text-muted">Next</span>
            <span className="t-body-sb mt-[4px] block">{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
