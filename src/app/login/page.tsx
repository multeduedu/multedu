"use client";

import { signIn } from "@/actions/auth";
import { useActionState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  const [state, formAction] = useActionState(handleLogin, { error: null });

  async function handleLogin(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Preencha todos os campos." };
    }

    const result = await signIn(formData);

    if (result.success) {
      window.location.href = "/";
      return { error: null };
    }

    return { error: result.error || "E-mail ou senha incorretos." };
  }

  return (
    <main className="h-screen w-screen flex overflow-hidden font-sans relative">

      {/* Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* IMAGEM */}
      <section aria-hidden="true" className="hidden md:block w-1/2 h-full">
        <img src="/login.avif" alt="" className="w-full h-full object-cover" />
      </section>

      {/* FORMULÁRIO */}
      <section className="
        w-full md:w-1/2 h-full
        flex items-center justify-center
        bg-[var(--color-background)]
        text-[var(--color-text-primary)]
        transition-colors
        relative px-6
      ">
        <Link
          href="/"
          className="
            absolute top-6 left-6
            flex items-center gap-2 text-3xl
            text-[var(--color-text-secondary)]
            hover:text-[var(--color-primary)]
            transition-colors
          "
        >
          <FiArrowLeft aria-hidden="true" />
        </Link>

        <div className="w-full max-w-md md:max-w-lg">

          <header className="mb-6 text-center md:text-left">
            <h1 className="text-2xl font-bold">
              Mult<span className="text-[var(--color-primary)]">Edu</span>
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Entre na sua conta para estudar!
            </p>
          </header>

          <form action={formAction} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm text-[var(--color-text-secondary)]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Digite seu email"
                className="
                  bg-[var(--color-input)]
                  border border-[var(--color-border)]
                  text-[var(--color-text-primary)]
                  rounded-md px-3 py-2 text-sm
                  outline-none
                  focus:ring-2 focus:ring-[var(--color-primary)]
                  transition-colors
                "
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm text-[var(--color-text-secondary)]">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                className="
                  bg-[var(--color-input)]
                  border border-[var(--color-border)]
                  text-[var(--color-text-primary)]
                  rounded-md px-3 py-2 text-sm
                  outline-none
                  focus:ring-2 focus:ring-[var(--color-primary)]
                  transition-colors
                "
                required
              />
            </div>

            <button
              type="submit"
              className="
                mt-3
                bg-[var(--color-primary)]
                hover:bg-[var(--color-primary-hover)]
                text-white
                font-medium py-2.5
                rounded-md text-sm
                transition-all
                shadow-md
                active:scale-95
                cursor-pointer
              "
            >
              Entrar no Portal
            </button>

            {state?.error && (
              <p className="
                text-center text-red-500 text-xs font-bold
                bg-red-50 dark:bg-red-900/20
                p-2 rounded-md border border-red-200
              ">
                {state.error}
              </p>
            )}
          </form>

          <div className="mt-6 text-sm text-[var(--color-text-secondary)]">
            Ainda não tem conta?{" "}
            <Link
              href="/cadastro"
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              Criar minha conta agora
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}