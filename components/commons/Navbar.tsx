'use client'
import { BASE_URL } from '@/lib/BASE_URL'
import axios from 'axios'
import { ChevronLeft, ChevronRight, LogOut, Search, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navLinks = [
    { title: 'Categories' },
    { title: 'Sale' },
    { title: 'Clearance' },
    { title: 'New stock' },
    { title: 'Trending' },
]

const Navbar = () => {
    const router = useRouter();
    const pathName = usePathname();
    const user = typeof window !== 'undefined' ?  JSON.parse(localStorage.getItem('user') || '{}') : {};
    const handleLogout = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/logout`);
            router.push('/signin');
        }
        catch (e) {
            console.log(`Error in handleLogout ${e}`);
        }
    }
    return (
        <div className='h-[10rem]'>
            <div className='flex flex-col gap-5 px-10 py-5'>

                <div className='ml-auto flex gap-5'>
                    <Link
                        className='text-sm'
                        href={'/'}>
                        Help
                    </Link>
                    <Link
                        className='text-sm'
                        href={'/'}>
                        Orders and Return
                    </Link>
                    {
                        pathName === '/' ?
                            <h1>Hi, {user.name}</h1>
                            :
                            <Link
                                className='text-sm'
                                href={'/signup'}>
                                SignUp
                            </Link>
                    }
                </div>

                <div className='flex items-center justify-between'>
                    <Link
                        href={'/'}
                        className='text-2xl font-bold'
                    >
                        ECOMMERCE
                    </Link>
                    <div className='flex gap-5'>
                        {
                            navLinks.map((link,index) => (
                                <Link
                                    key={index}
                                    href={'/'}
                                >
                                    {link.title}
                                </Link>
                            ))
                        }
                    </div>

                    <div className='flex gap-10'>
                        <Search />
                        <ShoppingCart />
                        <LogOut
                            onClick={handleLogout}
                            className='cursor-pointer' />
                    </div>
                </div>
            </div>

            <div className='py-2 gap-5 flex items-center justify-center bg-neutral-100'>
                <ChevronLeft />
                <h1 className='text-sm'>
                    Get 10% off on business sign up
                </h1>
                <ChevronRight />
            </div>
        </div>
    )
}

export default Navbar