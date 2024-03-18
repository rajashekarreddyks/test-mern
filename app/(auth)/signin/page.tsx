'use client'
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/lib/BASE_URL";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form"
import toast from "react-hot-toast";
import * as z from "zod";

const SignupPage = () => {

  const [type, setType] = useState<string>("password");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formSchema = z.object({
    password: z.string().min(6).max(20),
    email: z.string().email(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })
  const onSubmit = async (data: FieldValues) => {
    try {
      setLoading(true);
      const { data: res } = await axios.get(`${BASE_URL}/api/signin`, {
        params: {
          email: data.email,
          password: data.password
        }
      });
      toast.success('login sucess');
      window.location.href='/'
      const user = {
        userId: res.id,
        name: res.name
      }
      localStorage.setItem('user', JSON.stringify(user));

    }
    catch (e:any) {
      console.log(e);
      
      if(e.response.status===401){
        toast.error('Invalid credentials');
      }
      else{
        toast.error('Somthing went wrong');

      }
      console.log(`Error in onSubmit SignIn ${e}`);
    }
    finally {
      setLoading(false);
    }

  }
  const handleShowPwd = () => {
    type === 'password' ? setType("text") : setType('password');
  }
  return (
    <div className="flex items-center  justify-center w-full h-[calc(100vh-10rem)]">

      <div
        className="border w-1/3 p-10 rounded-xl flex flex-col gap-5">

        <h1 className="text-center text-2xl font-bold">
          Login
        </h1>
        <div className="space-y-2">
          <h1 className="text-center text-xl font-semibold">
            Welcome back to ECOMMERCE
          </h1>
          <h1 className="text-center text-sm">
            The next gen buisiness marketplace
          </h1>
        </div>
        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-8 ">

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter email" />
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
                      <div className="w-full border flex items-center rounded-md pr-2">
                        <Input
                          {...field}
                          type={type}
                          placeholder="Enter password"
                          className="border-none focus:outline-0 focus:border-0 focus:outline-none"
                        />
                        <Button
                          type="button"
                          onClick={handleShowPwd}
                          variant="ghost"
                          className="underline text-sm hover:bg-transparent">
                          Show
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                className="h-12 bg-black rounded-md flex gap-3 items-center"
                type="submit"
              >
                {
                  loading &&
                  <Loader2 className="animate-spin" />

                }
                LOGIN
              </Button>
              <hr className="" />
              <div className="flex gap-2 self-center ">
                <h1 className="text-neutral-500 text-sm">
                  Don&apos;t have an Account?
                </h1>
                <Link
                  className=""
                  href={'/signup'}>
                  SIGNUP
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