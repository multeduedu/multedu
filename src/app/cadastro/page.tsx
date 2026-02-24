"use client";

import { signUp } from "@/actions/auth";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useFormState } from "react-dom";
import { useState } from "react"; // Adicionado para gerenciar o estado de sucesso

export default function CadastroPage() {
  const [isSuccess, setIsSuccess] = useState(false); // Novo estado para o alerta
  
  // O useFormState gerencia os erros vindos da Server Action
  const [state, formAction] = useFormState(handleSubmit, { error: null });

  async function handleSubmit(prevState: any, formData: FormData) {
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmarSenha = formData.get("confirmarSenha") as string;

    // Validações de segurança no lado do cliente (OpSec)
    if (!nome || nome.length < 2) return { error: "Por favor, digite seu nome." };
    if (!email || !email.includes("@")) return { error: "E-mail inválido." };
    if (password !== confirmarSenha) {
      return { error: "As senhas não coincidem. Digite novamente." };
    }
    if (password.length < 6) {
      return { error: "A senha deve ter pelo menos 6 caracteres." };
    }

    // Chama a função de cadastro que você criou no Supabase
    const result = await signUp(formData);

    if (result.success) {
      setIsSuccess(true); // Ativa a mensagem de sucesso
      
      // Aguarda 3 segundos para que a criança veja o feedback antes do redirecionamento
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
      
      return { error: null };
    }

    return { error: result.error || "Erro ao tentar cadastrar." };
  }

  return (
    <main className="min-h-screen w-screen flex font-sans">
      {/* LADO DA IMAGEM (Desktop) */}
      <section className="hidden md:block md:w-1/2 h-screen">
        <img src="/login.avif" alt="Estudante" className="w-full h-full object-cover" />
      </section>

      {/* LADO DO FORMULÁRIO */}
      <section className="w-full md:w-1/2 min-h-screen flex items-center justify-center bg-white relative px-6 py-12">
        <Link href="/" className="absolute top-6 left-6 text-3xl text-gray-400 hover:text-[var(--color-primary)] transition-colors">
          <FiArrowLeft />
        </Link>

        <div className="w-full max-w-md">
          <header className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold">
              Mult<span className="text-[var(--color-primary)]">Edu</span>
            </h1>
            <p className="text-gray-500 mt-2">Crie sua conta para começar a aprender!</p>
          </header>

          <form action={formAction} className="flex flex-col gap-5">
            
            {/* ALERTA DE SUCESSO LÚDICO */}
            {isSuccess && (
              <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md animate-bounce shadow-sm">
                <p className="font-bold text-lg">Eba! Conta criada! 🎉</p>
                <p className="text-sm">Estamos te levando para o portal de matemática...</p>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <input name="nome" type="text" placeholder="Seu nome" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" required />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <input name="email" type="email" placeholder="email@exemplo.com" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Senha</label>
                <input name="password" type="password" placeholder="******" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Confirmar Senha</label>
                <input name="confirmarSenha" type="password" placeholder="******" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" required />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSuccess} // Desabilita o botão após o sucesso
              className={`mt-4 ${isSuccess ? 'bg-gray-400' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]'} text-white font-bold py-3 rounded-lg transition-all shadow-md active:scale-95`}
            >
              {isSuccess ? "Cadastrado!" : "Criar minha conta"}
            </button>

            {state?.error && (
              <p className="text-center text-red-500 text-sm font-bold bg-red-50 p-3 rounded-md border border-red-100">
                {state.error}
              </p>
            )}
          </form>

          <footer className="mt-8 text-center text-sm text-gray-600">
            Já tem uma conta? <Link href="/login" className="text-[var(--color-primary)] font-bold hover:underline">Entrar</Link>
          </footer>
        </div>
      </section>
    </main>
  );
}