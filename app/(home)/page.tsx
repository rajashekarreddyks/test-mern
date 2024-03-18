import { prisma } from '@/lib/prisma'
import Categories from './components/Categories'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { faker } from "@faker-js/faker";

const HomePage = async () => {

  const userId = Number(cookies().get('userId')?.value);
  if (!userId) redirect('/signin');

  let categories: {
    id: number,
    name: string,
    checked: boolean

  }[];

  categories = await prisma.category.findMany(
    {
      where: {
        userId
      },
      select: {
        checked: true,
        name: true,
        id: true
      },
      orderBy: {
        id: 'asc'
      }
    },

  );

  if (!categories || categories.length === 0) {

    const fakeCategories: string[] = [];
    for (let i = 0; i < 100; i++) {
      const category = faker.commerce.department();
      fakeCategories.push(category);

    }

    await prisma.category.createMany({
      data: [
        ...fakeCategories.map((item) => ({
          userId,
          name: item
        }))
      ],

    })
    categories = await prisma.category.findMany(
      {
        where: {
          userId
        },
        select: {
          checked: true,
          name: true,
          id: true
        },
        orderBy: {
          id: 'asc'
        }
      },

    );

  }

  return (
    <>
      <Categories categories={categories} />
    </>
  )
}

export default HomePage