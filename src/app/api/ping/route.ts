import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // O Next.js pega essas variáveis do painel da Vercel automaticamente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variáveis de ambiente do Supabase não configuradas.');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Faz uma consulta real na tabela keepalive
    const { data, error } = await supabase
      .from('keepalive')
      .select('*')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ status: 'ok', message: 'Supabase ativo!', data });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
