import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ApplicationStatus } from '@/types'

const COLUMN_ORDER: ApplicationStatus[] = [
  "APPLIED",
  "PHONE_SCREEN",
  "INTERVIEW",
  "TECHNICAL",
  "OFFER",
  "REJECTED",
  "GHOSTED",
];

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { applicationId, status, note } = await req.json()

  const targetIndex = COLUMN_ORDER.indexOf(status)
  // Delete the target status and any statuses that come after it in the pipeline
  // This prevents duplicates and ensures moving backwards removes "future" statuses
  const statusesToDelete = COLUMN_ORDER.slice(targetIndex)

  // run writes in one transaction — either all succeed or all fail
  const [, updated] = await prisma.$transaction([
    prisma.statusHistory.deleteMany({
      where: {
        applicationId,
        status: { in: statusesToDelete }
      }
    }),
    prisma.application.update({
      where: { id: applicationId, userId: session.user.id },
      data: { currentStatus: status },
    }),
    prisma.statusHistory.create({
      data: { applicationId, status, note },
    }),
  ])

  return NextResponse.json(updated)
}