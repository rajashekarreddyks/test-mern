'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { BASE_URL } from '@/lib/BASE_URL'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import React, { Suspense } from 'react'
import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast'
import { useMutation, useQuery } from 'react-query'
import * as z from "zod";

const VerifyPage = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const { mutate, isLoading } = useMutation({
        mutationFn: (data: FieldValues) => {
            return axios.post(`${BASE_URL}/api/signup/verify`, {
                email,
                otp: data.pin
            });
        },
        mutationKey: ['postUser'],
        onError(error: any) {
            console.log(error);
            if (error.response.status === 401) {
                toast.error('Invalid otp');
            }
            else {
                toast.error('Something went wrong');
            }

            console.log(`Error in onSubmit verify Post req ${error}`);
        },
        onSuccess(data) {
            toast.success('OTP Verified');
            router.push(`/`);
            const user = {
                userId: data.data.id,
                name: data.data.name
            }
            localStorage.setItem('user', JSON.stringify(user));
        }
    })
    const formSchema = z.object({
        pin: z.string().min(8, {
            message: 'Enter valid OTP'
        })
    })
    const form = useForm({
        resolver: zodResolver(formSchema)
    })
    const onSubmit = (data: FieldValues) => {
        //@ts-ignore
        mutate(data);

    }
    return (
        <div className='flex justify-center w-screen h-[calc(100vh-10rem)]'>
            <div className='w-1/3 border items-center h-[23rem] flex flex-col gap-5 rounded-xl p-10 mt-10'>
                <h1 className='text-center text-2xl font-semibold'>
                    Verify you email
                </h1>
                <Suspense>
                    <h1 className='text-center'>
                        Enter the 8 digit code you have received on &nbsp;
                        {email}
                    </h1>
                </Suspense>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='h-full flex flex-col gap-5'>
                                <FormField
                                    name="pin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Code
                                            </FormLabel>
                                            <FormControl>
                                                <InputOTP
                                                    maxLength={8}
                                                    render={({ slots }: any) => (
                                                        <InputOTPGroup className="gap-2">
                                                            {slots.map((slot: any, index: any) => (
                                                                <React.Fragment key={index}>
                                                                    <InputOTPSlot className="rounded-md border" {...slot} />
                                                                </React.Fragment>
                                                            ))}{" "}
                                                        </InputOTPGroup>
                                                    )}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}

                                />

                                <Button
                                    disabled={isLoading}
                                    type="submit"
                                    className="flex gap-3 items-center bg-black  h-10 mt-10"
                                >
                                    {
                                        isLoading &&
                                        <Loader2 className='animate-spin' />
                                    }
                                    VERIFY
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default VerifyPage