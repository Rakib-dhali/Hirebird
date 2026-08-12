import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

// GET /api/applications
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: {
      company: true,
      contacts: true,
      statusHistory: { orderBy: { changedAt: 'desc' }, take: 1 },
    },
    orderBy: { appliedAt: 'desc' },
  })

  return NextResponse.json(applications)
}

// POST /api/applications
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { role, jobUrl, salaryMin, salaryMax, source, companyName, companyWebsite } = body

  // upsert company — avoid duplicates
  const company = await prisma.company.upsert({
    where: { name: companyName },
    update: {},
    create: { name: companyName, website: companyWebsite },
  })

  const application = await prisma.application.create({
    data: {
      userId: session.user.id,
      companyId: company.id,
      role,
      jobUrl,
      salaryMin,
      salaryMax,
      source,
      currentStatus: 'APPLIED',
      statusHistory: {
        create: { status: 'APPLIED' }, // first history entry
      },
    },
    include: { company: true },
  })

  return NextResponse.json(application, { status: 201 })
}