"use client";

import { useState } from "react";
import { 
    FiPhone, 
    FiMail, 
    FiMapPin, 
    FiInstagram, 
    FiMessageCircle,
    FiLinkedin, 
    FiGithub,
    FiSend
} from "react-icons/fi";
import VoltarHomeButton from "@/components/VoltarHome";

interface FormData {
    nome: string;
    email: string;
    assunto: string;
    mensagem: string;
}

interface Errors {
    nome?: string;
    email?: string;
    assunto?: string;
    mensagem?: string;
}

export default function ContatoPage() {
    const [formData, setFormData] = useState<FormData>({
        nome: "",
        email: "",
        assunto: "",
        mensagem: "",
    });

    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (errors[e.target.name as keyof Errors]) {
            setErrors({ ...errors, [e.target.name]: undefined });
        }
    };

    const validate = (): Errors => {
        const newErrors: Errors = {};

        if (!formData.nome.trim()) {
            newErrors.nome = "Digite seu nome.";
        } else if (formData.nome.length < 2) {
            newErrors.nome = "O nome deve ter no mínimo 2 caracteres.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Digite seu email.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Digite um email válido.";
        }

        if (!formData.assunto.trim()) {
            newErrors.assunto = "Digite o assunto.";
        }

        if (!formData.mensagem.trim()) {
            newErrors.mensagem = "Escreva sua mensagem.";
        } else if (formData.mensagem.length < 10) {
            newErrors.mensagem = "A mensagem deve ter no mínimo 10 caracteres.";
        }

        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMessage("");

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);
            
            setTimeout(() => {
                console.log("Mensagem enviada:", formData);
                setIsSubmitting(false);
                setSuccessMessage("Sua mensagem foi enviada com sucesso!");
                setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
            }, 1000);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 py-10 px-6 sm:px-8 font-sans relative">
            
            <div className="max-w-6xl mx-auto">
                {/* Botão de Voltar */}
                <VoltarHomeButton href="/">
                    Voltar para Home
                </VoltarHomeButton>

                {/* Header da Página */}
                <header className="max-w-3xl mx-auto text-center mb-16">
                    <span className="text-[var(--color-primary)] font-bold text-xs tracking-widest uppercase mb-3 block">
                        Contato
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Vamos conversar?
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">
                        Entre em contato conosco. Estamos prontos para atender você e responder<br className="hidden md:block"/> todas as suas dúvidas.
                    </p>
                </header>

                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
                    
                    {/* Coluna da Esquerda: Informações de Contato */}
                    <section aria-label="Informações de contato" className="flex flex-col gap-4">
                        
                        {/* Card Telefone */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-4 shadow-sm">
                            <div className="bg-gray-100 p-3 rounded-md text-[var(--color-primary)]">
                                <FiPhone size={20} aria-hidden="true" />
                            </div>
                            <div>
                                <h2 className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Telefone</h2>
                                <p className="text-gray-900 font-medium">+55 (11) 99999-9999</p>
                            </div>
                        </div>

                        {/* Card E-mail */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-4 shadow-sm">
                            <div className="bg-gray-100 p-3 rounded-md text-[var(--color-primary)]">
                                <FiMail size={20} aria-hidden="true" />
                            </div>
                            <div>
                                <h2 className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">E-mail</h2>
                                <p className="text-gray-900 font-medium">multeduedu@gmail.com</p>
                            </div>
                        </div>

                        {/* Card Endereço */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-4 shadow-sm">
                            <div className="bg-gray-100 p-3 rounded-md text-[var(--color-primary)]">
                                <FiMapPin size={20} aria-hidden="true" />
                            </div>
                            <address className="not-italic">
                                <h2 className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Endereço</h2>
                                <p className="text-gray-900 font-medium">São Paulo, SP - Brasil</p>
                            </address>
                        </div>

                        {/* Redes Sociais */}
                        <div className="mt-4">
                            <h3 className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-wide">
                                Redes Sociais
                            </h3>
                            <div className="flex gap-3">
                                <a href="#" aria-label="Instagram" className="p-3 bg-white border border-gray-200 rounded-md text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] shadow-sm transition-colors">
                                    <FiInstagram size={18} />
                                </a>
                                <a href="#" aria-label="WhatsApp" className="p-3 bg-white border border-gray-200 rounded-md text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] shadow-sm transition-colors">
                                    <FiMessageCircle size={18} />
                                </a>
                                <a href="#" aria-label="LinkedIn" className="p-3 bg-white border border-gray-200 rounded-md text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] shadow-sm transition-colors">
                                    <FiLinkedin size={18} />
                                </a>
                                <a href="#" aria-label="GitHub" className="p-3 bg-white border border-gray-200 rounded-md text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] shadow-sm transition-colors">
                                    <FiGithub size={18} />
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Coluna da Direita: Formulário */}
                    <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Envie uma mensagem</h2>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nome */}
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="nome" className="text-sm text-gray-600">
                                        Nome
                                    </label>
                                    <input
                                        id="nome"
                                        name="nome"
                                        type="text"
                                        placeholder="Seu nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.nome}
                                        aria-describedby={errors.nome ? "nome-error" : undefined}
                                        className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                                            errors.nome ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.nome && <span id="nome-error" className="text-xs text-red-500">{errors.nome}</span>}
                                </div>

                                {/* E-mail */}
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="email" className="text-sm text-gray-600">
                                        E-mail
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.email}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                        className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                                            errors.email ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.email && <span id="email-error" className="text-xs text-red-500">{errors.email}</span>}
                                </div>
                            </div>

                            {/* Assunto */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="assunto" className="text-sm text-gray-600">
                                    Assunto
                                </label>
                                <input
                                    id="assunto"
                                    name="assunto"
                                    type="text"
                                    placeholder="Assunto da mensagem"
                                    value={formData.assunto}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.assunto}
                                    aria-describedby={errors.assunto ? "assunto-error" : undefined}
                                    className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                                        errors.assunto ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.assunto && <span id="assunto-error" className="text-xs text-red-500">{errors.assunto}</span>}
                            </div>

                            {/* Mensagem */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="mensagem" className="text-sm text-gray-600">
                                    Mensagem
                                </label>
                                <textarea
                                    id="mensagem"
                                    name="mensagem"
                                    rows={5}
                                    placeholder="Escreva sua mensagem aqui..."
                                    value={formData.mensagem}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.mensagem}
                                    aria-describedby={errors.mensagem ? "mensagem-error" : undefined}
                                    className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none ${
                                        errors.mensagem ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.mensagem && <span id="mensagem-error" className="text-xs text-red-500">{errors.mensagem}</span>}
                            </div>

                            {/* Botão Enviar e Feedback */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-70 text-white font-medium py-2.5 px-6 rounded-md text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 w-full md:w-auto"
                                >
                                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                                    {!isSubmitting && <FiSend size={16} aria-hidden="true" />}
                                </button>
                                
                                {successMessage && (
                                    <p className="mt-4 text-sm text-green-600 font-medium" role="status">
                                        {successMessage}
                                    </p>
                                )}
                            </div>

                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}