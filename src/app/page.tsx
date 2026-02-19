"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiLogIn } from "react-icons/fi";
import DarkButton from "@/components/DarkButton";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCloseMenu = () => setMenuOpen(false);

  return (
    <header
      id="title-main"
      className="bg-[url('/Home_Capa.avif')] bg-cover bg-center relative text-[var(--color-text-white)] h-screen overflow-hidden"
    >
      {/* NAVIGATION BAR */}
      <nav className="bg-[var(--color-navbar-bg)] px-6 py-3 flex items-center justify-between relative z-20">
        <Link href="/" className="text-2xl font-bold">
          Mult<span className="text-[var(--color-primary)]">Edu</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 items-center">
          <li>
            <Link
              href="/sobre"
              className="text-lg hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              Sobre nós
            </Link>
          </li>

          <li>
            <Link
              href="/metodo"
              className="text-lg hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              Nosso Método
            </Link>
          </li>

          <li>
            <Link
              href="/contato"
              className="text-lg hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              Contato
            </Link>
          </li>

          <li>
            <Link href="/login" aria-label="Entrar">
              <FiLogIn className="text-[var(--color-primary)] text-2xl hover:text-[var(--color-primary-hover)] transition-colors duration-200 cursor-pointer" />
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl z-30"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Mobile Menu */}
        <ul
          className={`md:hidden absolute top-full left-0 w-full bg-[var(--color-navbar-bg)]
          flex flex-col items-center gap-6 p-6 transition-all duration-300 ${menuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
            }`}
        >
          <li>
            <Link
              href="/sobre"
              onClick={handleCloseMenu}
              className="hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              Sobre nós
            </Link>
          </li>

          <li>
            <Link
              href="/metodo"
              onClick={handleCloseMenu}
              className="hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              Nosso Método
            </Link>
          </li>

          <li>
            <Link
              href="/contato"
              onClick={handleCloseMenu}
              className="hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              Contato
            </Link>
          </li>

          <li>
            <Link
              href="/login"
              onClick={handleCloseMenu}
              aria-label="Entrar"
            >
              <FiLogIn className="text-[var(--color-primary)] text-3xl hover:text-[var(--color-primary-hover)] transition-colors duration-200 cursor-pointer" />
            </Link>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <div className="flex items-center justify-start min-h-[calc(100vh-72px)] px-4 md:px-12">
        <div className="bg-[var(--color-primary-transparent)] flex flex-col justify-center items-center md:items-start p-6 rounded-[30px] w-full max-w-lg lg:ml-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-dark)] text-center md:text-left">
            Aprender{" "}
            <span className="font-extrabold drop-shadow-sm">
              matemática
            </span>{" "}
            pode ser{" "}
            <span className="font-extrabold drop-shadow-sm">
              divertido!
            </span>
          </h1>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <DarkButton href="/sobre">Conheça</DarkButton>
              <DarkButton href="/cadastro">Experimente</DarkButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
