/** Shown while a lazily loaded page (docs, app) is fetched. */
export default function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg" role="status" aria-label="Loading">
      <span className="h-[28px] w-[28px] animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}
