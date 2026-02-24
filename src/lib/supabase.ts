import { createClient } from '@supabase/supabase-js'

// Pegando as variáveis do seu arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validação de segurança: Impede que o app rode sem as chaves
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Erro: As chaves do Supabase não foram encontradas no .env.local')
}

// Exporta o cliente para ser usado em todo o MultEdu
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

