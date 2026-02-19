"use client";

import Link from "next/link";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

interface Errors {
  email?: string;
  senha?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors: Errors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Digite seu email.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Digite um email válido.";
    }

    if (!formData.senha.trim()) {
      newErrors.senha = "Digite sua senha.";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "A senha deve ter no mínimo 6 caracteres.";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Login enviado:", formData);
    }
  };

  return (
    <main className="h-screen w-screen flex overflow-hidden">

      {/* IMAGEM */}
      <section
        aria-hidden="true"
        className="hidden md:block w-1/2 h-full"
      >
        <img
          src="/login.avif"
          alt=""
          className="w-full h-full object-cover"
        />
      </section>

      {/* FORM */}
      <section className="w-full md:w-1/2 h-full flex items-center justify-center bg-white relative px-6">

        {/* Botão voltar */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-3xl text-gray-500 hover:text-[var(--color-primary)] transition-colors"
        >
          <FiArrowLeft aria-hidden="true" />
        </Link>

        <div className="w-full max-w-md md:max-w-lg">

          {/* Header */}
          <header className="mb-6 text-center md:text-left">
            <h1 className="text-2xl font-bold">
              Mult<span className="text-[var(--color-primary)]">Edu</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Entre na sua conta
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
            noValidate
          >

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm text-gray-600">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.email && (
                <span
                  id="email-error"
                  className="text-xs text-red-500"
                >
                  {errors.email}
                </span>
              )}
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1">
              <label htmlFor="senha" className="text-sm text-gray-600">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="Digite sua senha"
                value={formData.senha}
                onChange={handleChange}
                aria-invalid={!!errors.senha}
                aria-describedby="senha-error"
                className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.senha ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.senha && (
                <span
                  id="senha-error"
                  className="text-xs text-red-500"
                >
                  {errors.senha}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="mt-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium py-2.5 rounded-md text-sm transition-colors cursor-pointer"
            >
              Entrar
            </button>

          </form>

          <div className="mt-4 text-sm text-gray-600">
            Ainda não tem conta?{" "}
            <Link
              href="/cadastro"
              className="text-[var(--color-primary)] font-medium hover:opacity-80"
            >
              Criar conta
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
