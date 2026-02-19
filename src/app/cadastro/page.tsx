"use client";

import Link from "next/link";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

interface Errors {
    nome?: string;
    sobrenome?: string;
    email?: string;
    senha?: string;
    confirmarSenha?: string;
}

export default function CadastroPage() {
    const [formData, setFormData] = useState({
        nome: "",
        sobrenome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
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

        if (!formData.nome.trim()) {
            newErrors.nome = "Digite seu nome.";
        } else if (formData.nome.length < 2) {
            newErrors.nome = "O nome deve ter no mínimo 2 caracteres.";
        }

        if (!formData.sobrenome.trim()) {
            newErrors.sobrenome = "Digite seu sobrenome.";
        } else if (formData.sobrenome.length < 2) {
            newErrors.sobrenome = "O sobrenome deve ter no mínimo 2 caracteres.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Digite seu email.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Digite um email válido.";
        }

        if (!formData.senha.trim()) {
            newErrors.senha = "Crie uma senha.";
        } else if (formData.senha.length < 6) {
            newErrors.senha = "A senha deve ter no mínimo 6 caracteres.";
        }

        if (!formData.confirmarSenha.trim()) {
            newErrors.confirmarSenha = "Confirme sua senha.";
        } else if (formData.senha !== formData.confirmarSenha) {
            newErrors.confirmarSenha = "As senhas não coincidem.";
        }

        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            console.log("Cadastro enviado:", formData);
        }
    };

    return (
        <main className="min-h-screen w-screen flex">

            {/* IMAGEM */}
            <section
                aria-hidden="true"
                className="hidden md:block md:w-1/2 h-screen"
            >
                <img
                    src="/login.avif"
                    alt=""
                    className="w-full h-full object-cover"
                />
            </section>

            {/* FORM */}
            <section className="w-full md:w-1/2 min-h-screen md:h-screen flex items-center justify-center bg-white relative px-6 py-16 md:py-0">

                {/* Botão voltar */}
                <Link
                    href="/"
                    className="absolute top-6 left-6 flex items-center gap-2 text-3xl text-gray-500 hover:text-[var(--color-primary)] transition-colors"
                >
                    <FiArrowLeft aria-hidden="true" />
                </Link>

                <div className="w-full max-w-md md:max-w-lg">

                    <header className="mb-6 text-center lg:mt-10  md:text-left mt-12 md:mt-0">
                        <h1 className="text-2xl font-bold">
                            Mult<span className="text-[var(--color-primary)]">Edu</span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Crie sua conta
                        </p>
                    </header>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6 md:gap-4"
                        noValidate
                    >

                        {/* Nome + Sobrenome */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">

                            {/* Nome */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="nome" className="text-sm text-gray-600">
                                    Nome
                                </label>
                                <input
                                    id="nome"
                                    name="nome"
                                    type="text"
                                    placeholder="Digite seu nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.nome}
                                    aria-describedby="nome-error"
                                    className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.nome ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.nome && (
                                    <span id="nome-error" className="text-xs text-red-500">
                                        {errors.nome}
                                    </span>
                                )}
                            </div>

                            {/* Sobrenome */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="sobrenome" className="text-sm text-gray-600">
                                    Sobrenome
                                </label>
                                <input
                                    id="sobrenome"
                                    name="sobrenome"
                                    type="text"
                                    placeholder="Digite seu sobrenome"
                                    value={formData.sobrenome}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.sobrenome}
                                    aria-describedby="sobrenome-error"
                                    className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.sobrenome ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.sobrenome && (
                                    <span id="sobrenome-error" className="text-xs text-red-500">
                                        {errors.sobrenome}
                                    </span>
                                )}
                            </div>

                        </div>

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
                                <span id="email-error" className="text-xs text-red-500">
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
                                placeholder="Crie uma senha"
                                value={formData.senha}
                                onChange={handleChange}
                                aria-invalid={!!errors.senha}
                                aria-describedby="senha-error"
                                className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.senha ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.senha && (
                                <span id="senha-error" className="text-xs text-red-500">
                                    {errors.senha}
                                </span>
                            )}
                        </div>

                        {/* Confirmar Senha */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="confirmarSenha" className="text-sm text-gray-600">
                                Confirmar senha
                            </label>
                            <input
                                id="confirmarSenha"
                                name="confirmarSenha"
                                type="password"
                                placeholder="Confirme sua senha"
                                value={formData.confirmarSenha}
                                onChange={handleChange}
                                aria-invalid={!!errors.confirmarSenha}
                                aria-describedby="confirmarSenha-error"
                                className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.confirmarSenha ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.confirmarSenha && (
                                <span id="confirmarSenha-error" className="text-xs text-red-500">
                                    {errors.confirmarSenha}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="mt-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium py-2.5 rounded-md text-sm transition-colors cursor-pointer"
                        >
                            Criar conta
                        </button>

                    </form>

                    <div className="mt-4 text-sm text-gray-600 pb-8">
                        Já possui conta?{" "}
                        <Link
                            href="/login"
                            className="text-[var(--color-primary)] font-medium hover:opacity-80"
                        >
                            Entrar
                        </Link>
                    </div>

                </div>
            </section>
        </main>
    );
}
