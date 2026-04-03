export type ActivityType = "multiplicacao" | "soma" | "subtracao"

export type Activity = {
  id: string
  title: string
  image: string
  href: string
  type: ActivityType
}

export const activities: Activity[] = [
  {
    id: "10",
    title: "Soma",
    image: "/pag02_img.png",
    href: "/soma",
    type: "soma",
  },
  {
    id: "11",
    title: "Subtração",
    image: "/pag03_img.png",
    href: "/subtracao",
    type: "subtracao",
  },
]