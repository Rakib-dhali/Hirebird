import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { applicationId, name, email, linkedin, role } = await req.json()

  const contact = await prisma.contact.create({
    data: { applicationId, name, email, linkedin, role },
  })

  return NextResponse.json(contact, { status: 201 })
}