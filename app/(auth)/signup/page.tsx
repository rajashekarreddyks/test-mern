'use client'
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/lib/BASE_URL";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import * as z from "zod";

const SignupPage = () => {
  const router = useRouter();
  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => {
      return axios.post(`${BASE_URL}/api/signup/send-otp`, data);
    },
    mutationKey: ['postUser'],
    onError(error: any) {
      console.log(error);
      
      if (error.response.status === 409) {
        toast.error('User already exists')
      }
      else {
        toast.error('Something went wrong')

      }

      console.log(`Error in onSubmit User Post req ${error}`);
    },
    onSuccess(data) {
      router.push(`/signup/verify?email=${data.data.email}`);

    }
  })
  const formSchema = z.object({
    name: z.string().max(20),
    password: z.string().min(6).max(20),
    email: z.string().email(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })
  const onSubmit = async (data: FieldValues) => {
    //@ts-ignore
    mutate(data);
  }
  return (
    <div className="flex items-center  justify-center w-full h-[calc(100vh-10rem)]">

      <div
        className="border w-1/3 p-10 rounded-lg flex flex-col gap-5">

        <h1 className=" text-center text-2xl font-bold">
          Create your account
        </h1>

        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 ">

              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                className="h-12 bg-black flex gap-3 rounded-md"
                type="submit"
                disabled={isLoading}
              >
                {
                  isLoading && <Loader2 className="animate-spin" />
                }
                CREATE ACCOUNT
              </Button>

              <div className="flex gap-2 self-center mt-5">
                <h1 className="text-neutral-500 text-sm">
                  Have an Account?
                </h1>
                <Link
                  className=""
                  href={'/signin'}>
                  LOGIN
                </Link>
              </div>
            </div>
          </form>
        </Form>

      </div>
    </div>

  )
}

export default SignupPage