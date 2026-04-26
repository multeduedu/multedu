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
videoUrl: "geMzGlJzUkc",
helpText:{
1: "Mantenha o primeiro valor (da direita) e coloque na caixa.",
2: "Somar o 1º valor (da direita) ao 2º valor e coloque na caixa. Se a soma for 10 ou mais, guarde a dezena e coloque apenas a unidade.",
3: "Somar o 2º valor ao 3º valor e coloque na caixa. Some a dezena guardada (se houver). Se o total for 10 ou mais, guarde a nova dezena.",
4: "Somar o 3º valor ao 4º valor e coloque na caixa. Some a dezena guardada (se houver). Se o total for 10 ou mais, guarde a nova dezena.",
5: "Somar o 4º valor ao 5º valor e coloque na caixa. Some a dezena guardada (se houver). Se o total for 10 ou mais, coloque a dezena na próxima casa."
}
},
{
multiplicador: 2,
descricao: "",
regraMetade: false,
videoUrl: "XPylUHjQgxg",
helpText:{
1: "Dobrar o 1º valor e colocar na caixa.",
2: "Dobrar o 2º valor e colocar na caixa.",
3: "Dobrar o 3º valor e colocar na caixa.",
4: "Dobrar o 4º valor e colocar na caixa.",
5: "Dobrar o 5º valor e colocar na caixa."
}
},
{
multiplicador: 6,
descricao: "",
regraMetade: true,
videoUrl: "Mj1kefQltyU",
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
videoUrl: "4uIW08M3xQU",
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
videoUrl: "t5Tj47vdn9Y",
helpText:{
1: "Se for par o número é 0, se ímpar o número é 5.",
2: "Se ímpar somamos +5 e adicionamos metade do vizinho.",
3: "Se ímpar somamos +5 e adicionamos metade do vizinho.",
4: "Se ímpar somamos +5 e adicionamos metade do vizinho.",
5: "Se ímpar somamos +5 e adicionamos metade do vizinho."
}
},
{
multiplicador: 8,
descricao: "A multiplicação por 8 é semelhante à por 9, exceto que há duplicação.",
regraMetade: false,
videoUrl: "Mlfwvv-kFu4",
helpText:{
1: "Subtraia por -10 e dobre.",
2: "Substraia por -9 e dobre o valor. Em seguida, adicione o vizinho e, se for maior que 9, coloque um ponto e adicione +1 ao vizinho.",
3: "Substraia por -9 e dobre o valor. Em seguida, adicione o vizinho e, se for maior que 9, coloque um ponto e adicione +1 ao vizinho.",
4: "Substraia por -9 e dobre o valor. Em seguida, adicione o vizinho e, se for maior que 9, coloque um ponto e adicione +1 ao vizinho.",
5: "Subtraia por -2 do vizinho e, se o ponto estiver selecionado, adicione +1."
}
},
{
multiplicador: 9,
descricao: "O primeiro dígito subtraimos por -10. Já os demais subtraimos por -9 e, no último dígito, olhamos para o vizinho para saber se subtraimos por -1.",
regraMetade: false,
videoUrl: "UpXQoi_9kCs",
helpText:{
1: "Subtraia por -10.",
2: "Subtraia por -9 e adicione ao vizinho.",
3: "Subtraia por -9 e adicione ao vizinho.",
4: "Subtraia por -9 e adicione ao vizinho.",
5: "Subtrair por -1 ao vizinho."
}
},
{
multiplicador: 4,
descricao: "A multiplicação por 4 é semeslhante à por 9, exceto que agora pegamos a metade do vizinho.",
regraMetade: false,
videoUrl: "9rsbrrk8gSI",
helpText:{
1: "Subtraia por -10 e, se ímpar, adicione +5.",
2: "Subtraia por -9 e adicione a metade do vizinho e, se ímpar, adicione +5.",
3: "Subtraia por -9 e adicione a metade do vizinho e, se ímpar, adicione +5.",
4: "Subtraia por -9 e adicione a metade do vizinho e, se ímpar, adicione +5.",
5: "No último dígito, pegue metade do vizinho e subtraia por -1."
}
},
{
multiplicador: 3,
descricao: "A multiplicação por 3 é semelhante à por 8, exceto que agora pegamos a metade do vizinho e, se for ímpar, acionamos +5.",
regraMetade: false,
videoUrl: "9rsbrrk8gSI",
helpText:{
1: "Subtraia por -10 e dobre o valor e, se for ímpar, adicione +5.",
2: "Subtraia por -9, em seguida dobre o valor e adicione metade do vizinho. Se for ímpar, adicione +5.",
3: "Subtraia por -9, em seguida dobre o valor e adicione metade do vizinho. Se for ímpar, adicione +5.",
4: "Subtraia por -9, em seguida dobre o valor e adicione metade do vizinho. Se for ímpar, adicione +5.",
5: "No último dígito, pegue metade do vizinho e subtraia por -2."
}
}
]