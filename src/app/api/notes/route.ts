import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { applicationId, content } = await req.json()

  const note = await prisma.note.create({
    data: { applicationId, content },
  })

  return NextResponse.json(note, { status: 201 })
}