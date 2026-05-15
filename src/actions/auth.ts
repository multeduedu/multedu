'use server'

import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Resend } from 'resend'
import { logger } from '@/lib/logger'

const resend = new Resend(process.env.RESEND_API_KEY)

async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
          }
        },
      },
    }
  )
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nome = formData.get('nome') as string

  logger.info('Iniciando signup', { email })

  const supabase = await createSupabaseServerClient()

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

  if (error) {
    logger.error('Erro ao registrar usuário', error as Error, { email })
    return { error: error.message }
  }

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

    if (profileError) {
      logger.error('Erro ao criar perfil', profileError as Error, { userId: data.user.id })
      return { error: profileError.message }
    }

    try {
      await resend.emails.send({
        from: 'MultEdu <contato@multedu.com.br>',
        to: [email],
        subject: 'Bem-vindo ao MultEdu!',
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Olá, ${nome}!</h2>
            <p>Sua conta no <strong>MultEdu</strong> foi criada com sucesso.</p>
            <p>Agora você já pode acessar a plataforma e começar seus estudos de matemática!</p>
            <br />
            <a href="https://multedu.com.br/login" style="background: #fbbf24; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Fazer Login</a>
          </div>
        `
      });
      logger.info('Email de boas-vindas enviado', { email })
    } catch (mailError) {
      logger.warn('Erro ao enviar email de boas-vindas', { email, error: String(mailError) })
    }

    logger.info('Usuário registrado com sucesso', { userId: data.user.id, email })
  }

  redirect('/login')
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  logger.info('Tentativa de login', { email })

  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    logger.error('Falha no login', error as Error, { email })
    return { error: "E-mail ou senha incorretos." }
  }

  if (data?.user) {
    logger.info('Login bem-sucedido', { userId: data.user.id, email })
    redirect('/dashboard')
  }
}

export async function updateStudentRobot(robotStyle: string) {
  const supabase = await createSupabaseServerClient()
  
  const { data, error } = await supabase.auth.updateUser({
    data: { avatar_style: robotStyle }
  })
  
  if (error) return { error: error.message }
  return { success: true, data }
}

export async function signOut() {
  logger.info('Fazendo logout')
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  logger.info('Logout realizado com sucesso')
  redirect('/login')
}

export async function addCoins(amount: number) {
  if (!amount || amount <= 0) {
    logger.warn('Tentativa de adicionar XP inválido', { amount })
    return { error: "Valor de moedas inválido" }
  }

  if (amount > 100) {
    logger.warn('Tentativa de adicionar XP acima do limite', { amount })
    return { error: "Valor de moedas muito alto" }
  }
  
  const supabase = await createSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    logger.warn('Tentativa de adicionar XP sem autenticação')
    return { error: "Usuário não autenticado" }
  }

  logger.setContext({ userId: user.id })

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', user.id)
    .single();

  const currentCoins = profile?.xp || 0
  const newCoins = currentCoins + amount;

  const { error } = await supabase
    .from('profiles')
    .update({ xp: newCoins })
    .eq('id', user.id);

  if (error) {
    logger.error('Erro ao adicionar XP', error as Error, { amount, userId: user.id })
    return { error: error.message }
  }
  
  logger.info('XP adicionado com sucesso', { amount, newCoins, userId: user.id })
  return { success: true, newCoins };
}
export async function enviarEmailContato(nome: string, email: string, assunto: string, mensagem: string) {
  logger.info('Enviando email de contato', { nome, email, assunto })
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'MultEdu Contato <contato@multedu.com.br>',
      to: ['multeduedu@gmail.com'], 
      subject: `[CONTATO SITE] ${assunto}`,
      replyTo: email, 
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #fbbf24;">Nova mensagem recebida!</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Assunto:</strong> ${assunto}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensagem:</strong></p>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">${mensagem}</p>
        </div>
      `
    });

    if (error) {
      logger.error('Erro ao enviar email de contato', error as Error, { email })
      return { error: error.message };
    }

    logger.info('Email de contato enviado com sucesso', { email })
    return { success: true };
  } catch (err) {
    logger.error('Erro ao enviar email de contato', err as Error, { email })
    return { error: "Erro interno no servidor de e-mail." };
  }
}
