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
  FiSend,
} from "react-icons/fi";
import VoltarHomeButton from "@/components/ui/VoltarHome";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
      newErrors.mensagem =
        "A mensagem deve ter no mínimo 10 caracteres.";
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
        setIsSubmitting(false);
        setSuccessMessage("Sua mensagem foi enviada com sucesso!");
        setFormData({
          nome: "",
          email: "",
          assunto: "",
          mensagem: "",
        });
      }, 1000);
    }
  };

  return (
    <main
      className="
        min-h-screen w-full
        bg-[var(--color-background)]
        text-[var(--color-text-primary)]
        transition-colors
        duration-300
        relative
      "
    >
      {/* Toggle - mesmo padrão do Sobre */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* Botão Voltar - mesmo padrão do Sobre */}
        <VoltarHomeButton href="/">
          Voltar para Home
        </VoltarHomeButton>

        {/* HERO */}
        <header className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-[var(--color-primary)] font-bold text-xs tracking-widest uppercase mb-3 block">
            Contato
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Vamos conversar?
          </h1>

          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
            Entre em contato conosco. Estamos prontos para atender você e responder
            <br className="hidden md:block" /> todas as suas dúvidas.
          </p>
        </header>

        {/* CONTEÚDO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Coluna esquerda */}
          <section className="flex flex-col gap-4">
            {[
              { icon: <FiPhone size={20} />, title: "Telefone", value: "+55 (11) 99999-9999" },
              { icon: <FiMail size={20} />, title: "E-mail", value: "multeduedu@gmail.com" },
              { icon: <FiMapPin size={20} />, title: "Endereço", value: "São Paulo, SP - Brasil" }
            ].map((item, index) => (
              <div
                key={index}
                className="
                  bg-[var(--color-card)]
                  border border-[var(--color-border)]
                  rounded-lg p-5
                  flex items-center gap-4
                  shadow-sm
                  transition-colors
                "
              >
                <div className="bg-[var(--color-input)] p-3 rounded-md text-[var(--color-primary)]">
                  {item.icon}
                </div>
                <div>
                  <h2 className="text-xs text-[var(--color-text-secondary)] font-semibold mb-1 uppercase tracking-wide">
                    {item.title}
                  </h2>
                  <p className="font-medium">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* Formulário */}
          <section
            className="
              bg-[var(--color-card)]
              border border-[var(--color-border)]
              rounded-xl
              p-8
              shadow-sm
              transition-colors
            "
          >
            <h2 className="text-xl font-bold mb-6">
              Envie uma mensagem
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

              {["nome", "email", "assunto"].map((field) => (
                <div key={field} className="flex flex-col gap-1">
                  <label className="text-sm text-[var(--color-text-secondary)] capitalize">
                    {field}
                  </label>
                  <input
                    name={field}
                    type={field === "email" ? "email" : "text"}
                    value={formData[field as keyof FormData]}
                    onChange={handleChange}
                    className={`
                      bg-[var(--color-input)]
                      text-[var(--color-text-primary)]
                      border rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
                      ${
                        errors[field as keyof Errors]
                          ? "border-red-500"
                          : "border-[var(--color-border)]"
                      }
                    `}
                  />
                  {errors[field as keyof Errors] && (
                    <span className="text-xs text-red-500">
                      {errors[field as keyof Errors]}
                    </span>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--color-text-secondary)]">
                  Mensagem
                </label>
                <textarea
                  name="mensagem"
                  rows={5}
                  value={formData.mensagem}
                  onChange={handleChange}
                  className={`
                    bg-[var(--color-input)]
                    text-[var(--color-text-primary)]
                    border rounded-md px-3 py-2 text-sm resize-none
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
                    ${
                      errors.mensagem
                        ? "border-red-500"
                        : "border-[var(--color-border)]"
                    }
                  `}
                />
                {errors.mensagem && (
                  <span className="text-xs text-red-500">
                    {errors.mensagem}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  mt-3
                  bg-[var(--color-primary)]
                  hover:bg-[var(--color-primary-hover)]
                  disabled:opacity-70
                  text-white
                  font-medium
                  py-2.5 px-6
                  rounded-md
                  text-sm
                  transition-colors
                  flex items-center justify-center gap-2
                  w-full md:w-auto
                  cursor-pointer
                "
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                {!isSubmitting && <FiSend size={16} />}
              </button>

              {successMessage && (
                <p className="mt-4 text-sm text-green-500 font-medium">
                  {successMessage}
                </p>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}