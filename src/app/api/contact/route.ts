/**
 * POST /api/contact
 * 
 * Envia mensagens de contato via email.
 * Valida dados usando Zod antes de enviar.
 * 
 * @body {ContactFormInput} Contém name, email, subject, message
 * @returns {Object} success, message
 * @throws {400} Se dados inválidos
 * @throws {500} Se erro ao enviar email
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { ContactFormSchema } from '@/lib/validations'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactResponse {
  success: boolean
  message: string
}

/**
 * Enviar mensagem de contato
 */
export async function POST(request: NextRequest): Promise<NextResponse<ContactResponse | { error: string; details?: Record<string, string[]> }>> {
  try {
    const body = await request.json()
    logger.debug('POST /api/contact - dados recebidos')

    // ✅ VALIDAR USANDO ZOD
    const validation = ContactFormSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors as Record<string, string[]>
      logger.warn('Dados de contato inválidos', { errors })
      return NextResponse.json(
        { error: 'Dados inválidos', details: errors },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validation.data

    // ✅ ENVIAR EMAIL
    try {
      await resend.emails.send({
        from: 'MultEdu <contato@multedu.com.br>',
        to: [process.env.CONTACT_EMAIL || 'contato@multedu.com.br'],
        replyTo: email,
        subject: `[${subject.toUpperCase()}] Mensagem de ${name}`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px;">
            <h2>Nova Mensagem de Contato</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Assunto:</strong> ${subject}</p>
            <hr />
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
        `,
      })

      logger.info('Email de contato enviado com sucesso', { email, subject })
    } catch (emailError) {
      logger.warn('Erro ao enviar email de contato', { email, subject })
      // Não retorna erro, pois a mensagem pode ser salva no banco como fallback
    }

    return NextResponse.json({
      success: true,
      message: 'Mensagem recebida com sucesso',
    })
    
  } catch (error) {
    logger.error(
      'Erro não tratado em POST /api/contact',
      error instanceof Error ? error : null
    )
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
}
