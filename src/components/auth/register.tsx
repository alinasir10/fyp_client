'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm, FieldErrors } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Spinner from "@/components/loading/spinner";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterComponent() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const inputElement = event.target;
    requestAnimationFrame(() => {
      inputElement.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/register', data);
      const { status, message, redirect } = response.data;

      if (status) {
        toast({ title: message, variant: 'default' });
        if (redirect === 'verify') {
          router.push('/verify');
        }
      } else {
        toast({
          title: 'Registration Failed',
          variant: 'destructive',
          description: message,
        });
      }
    } catch (error: unknown) {
      console.error('Registration Error:', error);
      toast({
        title: 'Registration Failed',
        variant: 'destructive',
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    const errorMessages = Object.values(errors)
      .map((error) => error?.message)
      .filter((msg): msg is string => msg !== undefined);

    toast({
      title: "Please fix the following errors:",
      variant: "destructive",
      description: (
        <ul className="list-disc pl-5">
          {errorMessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      ),
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({field, fieldState}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    disabled={loading}
                    className={`w-full ${fieldState.invalid ? "ring-2 ring-red-500" : ""}`}
                    onFocus={handleFocus}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({field, fieldState}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    disabled={loading}
                    className={`w-full ${fieldState.invalid ? "ring-2 ring-red-500" : ""}`}
                    onFocus={handleFocus}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit" className="w-full">
            {loading ? <Spinner/> : "Register"}
          </Button>

          <div className={'w-full text-sm flex items-center gap-2'}>
            <p>Already have an account?{" "}</p>
            <Link href="/login" className="hover:underline">Login</Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
