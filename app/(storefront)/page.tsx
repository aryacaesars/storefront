// Storefront home — placeholder on the `auth` branch.
// Real theme-rendered home lands later (themes/ engine, guide §4-5).
// Exists so `/` resolves and the build passes while testing auth.
export default function StorefrontHome() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Storefront</h1>
      <p className="text-sm text-foreground/60">
        Placeholder. Auth dulu — buka{" "}
        <a href="/login" className="underline">
          /login
        </a>
        .
      </p>
    </main>
  );
}
