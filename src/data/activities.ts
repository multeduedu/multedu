export type ActivityType = "multiplicacao" | "soma" | "subtracao"

export type Activity = {
  id: string
  title: string
  image: string
  href: string
  type: ActivityType
}

export const activities: Activity[] = [
  // Multiplicação - Metodologia Trachtenberg
  {
    id: "1",
    title: "Multiplicação por 11",
    image: "/pag01_img.png",
    href: "/atividades/multiplicacao-11",
    type: "multiplicacao",
  },
  {
    id: "2",
    title: "Multiplicação por 6",
    image: "/pag05_img.png",
    href: "/atividades/multiplicacao-6",
    type: "multiplicacao",
  },
  {
    id: "3",
    title: "Multiplicação por 7",
    image: "/pag06_img.png",
    href: "/atividades/multiplicacao-7",
    type: "multiplicacao",
  },
  {
    id: "4",
    title: "Multiplicação por 5",
    image: "/pag07_img.png",
    href: "/atividades/multiplicacao-5",
    type: "multiplicacao",
  },
  {
    id: "5",
    title: "Multiplicação por 2",
    image: "/pag04_img.png",
    href: "/atividades/multiplicacao-2",
    type: "multiplicacao",
  },
  {
    id: "6",
    title: "Multiplicação por 8",
    image: "/pag09_img.png",
    href: "/atividades/multiplicacao-8",
    type: "multiplicacao",
  },
  {
    id: "7",
    title: "Multiplicação por 9",
    image: "/pag08_img.png",
    href: "/atividades/multiplicacao-9",
    type: "multiplicacao",
  },
  {
    id: "8",
    title: "Multiplicação por 4",
    image: "/pag10_img.png",
    href: "/atividades/multiplicacao-4",
    type: "multiplicacao",
  },
  {
    id: "9",
    title: "Multiplicação por 3",
    image: "/pag11_img.png",
    href: "/atividades/multiplicacao-3",
    type: "multiplicacao",
  },

  // Soma e Subtração
  {
    id: "10",
    title: "Soma",
    image: "/pag02_img.png",
    href: "/atividades/soma",
    type: "soma",
  },
  {
    id: "11",
    title: "Subtração",
    image: "/pag03_img.png",
    href: "/atividades/subtracao",
    type: "subtracao",
  },
]