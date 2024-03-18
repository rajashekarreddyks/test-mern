import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { BASE_URL } from './lib/BASE_URL'
import { isAuth } from './lib/jwt'

export async function middleware (req: NextRequest) {

  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/signin`)
  }

  const isAuthenticated = await isAuth(token)

  if (!isAuthenticated) {
    return NextResponse.redirect(`${BASE_URL}/signin`)
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher:['/','/api/categories/set-categories']
}