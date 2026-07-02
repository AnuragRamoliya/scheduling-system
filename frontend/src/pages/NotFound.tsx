import { Link } from "react-router-dom";

export const NotFound = () => (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-ink">
    <section className="max-w-md text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-coral">404</p>
      <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-slate-600">This booking link may be inactive, ungenerated, or mistyped.</p>
      <Link className="mt-6 inline-block rounded-md bg-moss px-4 py-2 font-medium text-white hover:bg-moss/90" to="/login">
        Back to sign in
      </Link>
    </section>
  </main>
);
