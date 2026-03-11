export type DigitIndex = 1 | 2 | 3 | 4 | 5

export interface MultiplicadorData {
  multiplicador: number
  descricao: string
  regraMetade: boolean
  videoUrl: string
  helpText: Record<DigitIndex, string>
}

export const DadosMultiplicadores: MultiplicadorData[] = [
{
multiplicador: 11,
descricao: "",
regraMetade: false,
videoUrl: "https://www.youtube.com/watch?v=geMzGlJzUkc",
helpText:{
1: "Mantenha o primeiro valor (da direita) e coloque na caixa.",
2: "Somar o 1º valor (da direita) ao 2º valor e coloque na caixa. Se a soma for 10 ou mais, guarde a dezena e coloque apenas a unidade.",
3: "Somar o 2º valor ao 3º valor e coloque na caixa. Some a dezena guardada (se houver). Se o total for 10 ou mais, guarde a nova dezena.",
4: "Somar o 3º valor ao 4º valor e coloque na caixa. Some a dezena guardada (se houver). Se o total for 10 ou mais, guarde a nova dezena.",
5: "Somar o 4º valor ao 5º valor e coloque na caixa. Some a dezena guardada (se houver). Se o total for 10 ou mais, coloque a dezena na próxima casa."
}
},

{
multiplicador: 6,
descricao: "",
regraMetade: true,
videoUrl: "https://www.youtube.com/watch?v=Mj1kefQltyU",
helpText:{
1: "Mantenha o 1° dígito se par. Se for ímpar, adicione +5.",
2: "Some o 2° dígito com a metade do vizinho à direita. Se for ímpar, adicione +5.",
3: "Some o 3° dígito com a metade do vizinho à direita. Se for ímpar, adicione +5.",
4: "Some o 4° dígito com a metade do vizinho à direita. Se for ímpar, adicione +5.",
5: "Some o 5° dígito com a metade do vizinho à direita. Se for ímpar, adicione +5."
}
},

{
multiplicador: 7,
descricao: "Dobre o número e some metade do vizinho; adicione 5 se o número for ímpar.",
regraMetade: false,
videoUrl: "https://www.youtube.com/watch?v=4uIW08M3xQU",
helpText:{
1: "Dobrar o 1° dígito se for par. Se for ímpar, adicione +5 ao resultado.",
2: "Dobrar o 2° dígito e somar metade do vizinho à direita. Se for ímpar, adicione +5.",
3: "Dobrar o 3° dígito e somar metade do vizinho à direita. Se for ímpar, adicione +5.",
4: "Dobrar o 4° dígito e somar metade do vizinho à direita. Se for ímpar, adicione +5.",
5: "Metade do vizinho à direita. Se for ímpar, adicione +5."
}
},

{
multiplicador: 5,
descricao: "Se for ímpar adicionamos 5 e mais metade do vizinho.",
regraMetade: true,
videoUrl: "https://www.youtube.com/watch?v=t5Tj47vdn9Y",
helpText:{
1: "Se for par o número é 0, se ímpar o número é 5.",
2: "Se ímpar somamos +5 e adicionamos metade do vizinho.",
3: "Se ímpar somamos +5 e adicionamos metade do vizinho.",
4: "Se ímpar somamos +5 e adicionamos metade do vizinho.",
5: "Se ímpar somamos +5 e adicionamos metade do vizinho."
}
},

{
multiplicador: 2,
descricao: "",
regraMetade: false,
videoUrl: "https://www.youtube.com/watch?v=XPylUHjQgxg",
helpText:{
1: "Dobrar o 1º valor e colocar na caixa.",
2: "Dobrar o 2º valor e colocar na caixa.",
3: "Dobrar o 3º valor e colocar na caixa.",
4: "Dobrar o 4º valor e colocar na caixa.",
5: "Dobrar o 5º valor e colocar na caixa."
}
}
]