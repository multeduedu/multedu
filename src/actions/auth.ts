'use server'

import { supabase } from '@/lib/supabase'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string // Nome deve ser igual ao input
  const nome = formData.get('nome') as string

  // 1. Cadastra o usuário no sistema de Auth do Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) return { error: error.message }

  // 2. Se o cadastro deu certo, cria o perfil na sua tabela 'profiles'
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: data.user.id, 
          nome: nome,
          nivel_atual: 'Regra do 11',
          xp: 0 
        }
      ])

    if (profileError) return { error: profileError.message }
  }

  return { success: true }
}

// Esta função que será usada na página de login
export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }

  return { success: true }
}