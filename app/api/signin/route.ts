import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { jwtSign } from '@/lib/jwt'


export async function GET (req: NextRequest, res: NextResponse) {
  try {
    const email = req.nextUrl.searchParams.get('email')
    const password = req.nextUrl.searchParams.get('password')

    if (!email)
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    if (!password)
      return NextResponse.json(
        { error: 'password is required' },
        { status: 400 }
      )

    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if (!user)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )

    const token = await jwtSign();

    const response = NextResponse.json(user, { status: 200 })

    response.cookies.set('token', token, {
      httpOnly: true
    })
    response.cookies.set('userId',user.id.toString())

    return response
  } catch (e) {
    console.log(`Error in signin GET req ${e}`)
    return NextResponse.json(
      { error: `Error in signin GET req ${e}` },
      { status: 500 }
    )
  }
}