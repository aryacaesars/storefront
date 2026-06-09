import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/dal";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata = { title: "Masuk — Storefront Builder" };

export default async function LoginPage() {
  // Already signed in? Skip the form.
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Storefront Builder</h1>
          <p className="mt-2 text-sm text-foreground/60">
            Hubungkan akun Scalev kamu untuk mulai membangun storefront.
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-foreground/50">
          Belum punya akun Scalev? Onboarding membutuhkan akun Scalev aktif.
        </p>
      </div>
    </main>
  );
}
