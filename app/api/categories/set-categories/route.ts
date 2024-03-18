import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'


export async function PATCH (req: NextRequest, res: NextResponse) {
  try {

    const { categoryIds } = await req.json();

    const userId = Number(req.cookies.get('userId')?.value)

    if (!userId)
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 403 })

    if (!categoryIds || categoryIds.length === 0)
      return NextResponse.json(
        { error: 'CategoryIds is required' },
        { status: 400 }
      )

      await prisma.category.updateMany({
        where:{
          userId,
        },
        data:{
          checked:false
        }
      });
      
    const updatedCategories = await prisma.category.updateMany({
      where: {
        userId,
        id: {
          in: [...categoryIds.map((item: number) => item)]
        }
      },
      data: {
        checked: true
      }
    })

    return NextResponse.json(updatedCategories, { status: 200 })
  } catch (e) {
    console.log(`Error in set-categories PATCH ${e}`)
    return NextResponse.json(
      { error: `Error in set-categories PATCH ${e}` },
      { status: 500 }
    )
  }
}