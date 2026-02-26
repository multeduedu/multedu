"use client";

import { signUp } from "@/actions/auth";
import { useActionState } from "react";
import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function CadastroPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [state, formAction] = useActionState(handleSubmit, { error: null });

  async function handleSubmit(prevState: any, formData: FormData) {
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmarSenha = formData.get("confirmarSenha") as string;

    if (!nome || nome.length < 2)
      return { error: "Digite seu nome corretamente." };

    if (!email || !email.includes("@"))
      return { error: "E-mail inválido." };

    if (!password || !confirmarSenha)
      return { error: "Preencha todos os campos." };

    if (password !== confirmarSenha)
      return { error: "As senhas não coincidem." };

    if (password.length < 6)
      return { error: "A senha deve ter pelo menos 6 caracteres." };

    const result = await signUp(formData);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return { error: null };
    }

    return { error: result.error || "Erro ao tentar cadastrar." };
  }

  return (
    <main className="h-screen w-screen flex overflow-hidden font-sans relative">

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <section aria-hidden="true" className="hidden md:block w-1/2 h-full">
        <img src="/login.avif" alt="" className="w-full h-full object-cover" />
      </section>

      <section
        className="
          w-full md:w-1/2 h-full
          flex items-center justify-center
          bg-[var(--color-background)]
          text-[var(--color-text-primary)]
          transition-colors
          relative px-6
        "
      >
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
              Crie sua conta para começar a estudar!
            </p>
          </header>

          <form action={formAction} className="flex flex-col gap-4">

            {isSuccess && (
              <p className="
                text-center text-green-600 text-xs font-bold
                bg-green-50 dark:bg-green-900/20
                p-2 rounded-md border border-green-200
              ">
                Conta criada com sucesso! Redirecionando...
              </p>
            )}

            <div className="flex flex-col gap-1">
              <label htmlFor="nome" className="text-sm text-[var(--color-text-secondary)]">
                Nome
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="Digite seu nome"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm text-[var(--color-text-secondary)]">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="******"
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
                <label htmlFor="confirmarSenha" className="text-sm text-[var(--color-text-secondary)]">
                  Confirmar Senha
                </label>
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  placeholder="******"
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
            </div>

            <button
              type="submit"
              disabled={isSuccess}
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
                disabled:opacity-70
              "
            >
              Criar minha conta
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
            Já tem conta?{" "}
            <Link
              href="/login"
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              Entrar agora
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}