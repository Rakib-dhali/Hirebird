import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id

  const [total, responded, byStatus, bySource] = await Promise.all([
    // total applications
    prisma.application.count({ where: { userId } }),

    // responded = moved past APPLIED/GHOSTED
    prisma.application.count({
      where: { userId, currentStatus: { notIn: ['APPLIED', 'GHOSTED'] } },
    }),

    // breakdown by status
    prisma.application.groupBy({
      by: ['currentStatus'],
      where: { userId },
      _count: true,
    }),

    // breakdown by source (LinkedIn, Arc, etc.)
    prisma.application.groupBy({
      by: ['source'],
      where: { userId },
      _count: true,
    }),
  ])

  return NextResponse.json({
    total,
    responseRate: total ? ((responded / total) * 100).toFixed(1) : 0,
    byStatus,
    bySource,
  })
}