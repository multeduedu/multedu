"use client";

import { signIn } from "@/actions/auth"; // Importa a função de login que criamos
import { useFormState } from "react-dom";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function LoginPage() {
  // O useFormState gerencia os erros vindos do Supabase
  const [state, formAction] = useFormState(handleLogin, { error: null });

  async function handleLogin(prevState: any, formData: FormData) {
    // 1. Validação básica de frontend
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Preencha todos os campos." };
    }

    // 2. Tenta fazer o login no Supabase
    const result = await signIn(formData);

    if (result.success) {
      // 3. Se deu certo, redireciona para a página inicial (ou dashboard) devemos mudar AQUI para a página de perfil ou dashboard
      window.location.href = "/";
      return { error: null };
    }

    // 4. Se deu erro, retorna a mensagem do banco (ex: "Invalid login credentials")
    return { error: result.error || "E-mail ou senha incorretos." };
  }

  return (
    <main className="h-screen w-screen flex overflow-hidden font-sans">
      {/* IMAGEM */}
      <section aria-hidden="true" className="hidden md:block w-1/2 h-full">
        <img src="/login.avif" alt="" className="w-full h-full object-cover" />
      </section>

      {/* FORMULÁRIO */}
      <section className="w-full md:w-1/2 h-full flex items-center justify-center bg-white relative px-6">
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-3xl text-gray-500 hover:text-[var(--color-primary)] transition-colors"
        >
          <FiArrowLeft aria-hidden="true" />
        </Link>

        <div className="w-full max-w-md md:max-w-lg">
          <header className="mb-6 text-center md:text-left">
            <h1 className="text-2xl font-bold">
              Mult<span className="text-[var(--color-primary)]">Edu</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Entre na sua conta para estudar!</p>
          </header>

          {/* O formAction conecta com a lógica do servidor */}
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm text-gray-600">Email</label>
              <input
                id="email"
                name="email" // O nome deve ser exatamente como a Action espera
                type="email"
                placeholder="Digite seu email"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm text-gray-600">Senha</label>
              <input
                id="password"
                name="password" // Mudamos de 'senha' para 'password' para bater com o banco
                type="password"
                placeholder="Digite sua senha"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium py-2.5 rounded-md text-sm transition-all shadow-md active:scale-95"
            >
              Entrar no Portal
            </button>

            {/* Exibe o erro real que vem do Supabase */}
            {state?.error && (
              <p className="text-center text-red-500 text-xs font-bold bg-red-50 p-2 rounded-md border border-red-100 animate-pulse">
                {state.error}
              </p>
            )}
          </form>

          <div className="mt-6 text-sm text-gray-600">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="text-[var(--color-primary)] font-medium hover:underline">
              Criar minha conta agora
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}