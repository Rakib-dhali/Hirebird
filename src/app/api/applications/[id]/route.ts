import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const application = await prisma.application.findUnique({
    where: { id, userId: session.user.id },
    include: {
      company: true,
      contacts: true,
      notes: { orderBy: { createdAt: 'desc' } },
      statusHistory: { orderBy: { changedAt: 'desc' } },
    },
  })

  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(application)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const updated = await prisma.application.update({
    where: { id, userId: session.user.id },
    data: {
      role: body.role,
      jobUrl: body.jobUrl,
      salaryMin: body.salaryMin,
      salaryMax: body.salaryMax,
      source: body.source,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  await prisma.application.delete({
    where: { id, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}