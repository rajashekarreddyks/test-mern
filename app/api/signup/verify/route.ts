import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { jwtSign } from '@/lib/jwt'

export async function POST (req: NextRequest, res: NextResponse) {
  try {
    const { otp, email } = await req.json()

    if (!otp)
      return NextResponse.json({ error: 'otp is required' }, { status: 400 })

    const isOtpCorrect = await prisma.user.findFirst({
      where: {
        otp,
        email
      }
    })


    if (!isOtpCorrect)
      return NextResponse.json({ error: 'Invalid Otp' }, { status: 401 })

    const updatedUser = await prisma.user.update({
      where: {
        otp,
        email,
        id: isOtpCorrect.id
      },
      data: {
        isVerified: true
      }
    })

    const token = await jwtSign()

    const response = NextResponse.json(updatedUser, { status: 200 })

    response.cookies.set('token', token, {
      httpOnly: true
    })
    response.cookies.set('userId', updatedUser.id.toString())

    return response
  } catch (e) {
    console.log(`Error in Veriy POST req ${e}`)
    return NextResponse.json(
      { error: `Error in Veriy POST req ${e}` },
      { status: 500 }
    )
  }
}