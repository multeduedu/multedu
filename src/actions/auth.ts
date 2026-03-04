'use server'

import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nome = formData.get('nome') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: nome,
        avatar_style: 'bottts'
      }
    }
  })

  if (error) return { error: error.message }

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

  // Correção: Após criar a conta, envia para o login para validar o acesso real
  redirect('/login')
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }

  if (data?.user) {
    redirect('/dashboard')
  }
}

export async function updateStudentRobot(robotStyle: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: { avatar_style: robotStyle }
  })
  
  if (error) return { error: error.message }
  return { success: true, data }
}

export async function signOut() {
  await supabase.auth.signOut()
  redirect('/login')
}

export async function addExperience(amount: number) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Usuário não autenticado" };

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', user.id)
    .single();

  const newXP = (profile?.xp || 0) + amount;

  const { error } = await supabase
    .from('profiles')
    .update({ xp: newXP })
    .eq('id', user.id);

  if (error) return { error: error.message };
  return { success: true, newXP };
}