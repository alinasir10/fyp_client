'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ArrowLeft, Mail } from "lucide-react";
import {FieldErrors, useForm} from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {getGoogleAuthURL} from "@/app/actions/auth";
import axiosInstance from "@/lib/axiosInstance";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

type FormValues = z.infer<typeof formSchema>;

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function LoginComponent() {
  const { toast } = useToast();
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const inputElement = event.target;
    setTimeout(() => {
      inputElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  async function handleGoogleLogin() {
    try {
      const { data } = await axiosInstance.get('/auth/oauth/google', {withCredentials: true});
      const oauthWindow = window.open(data.url, '_self');
      if (!oauthWindow) {
        throw new Error('Failed to open Google OAuth login window');
      }
    } catch (error) {
      console.error('Google OAuth Error:', error);
      toast({
        title: 'Login Failed',
        description: 'Failed to initiate Google OAuth.',
        variant: 'destructive',
      });
    }
  }


  // const handleGoogleLogin = async () => {
  //   // window.location.href = 'http://localhost:5000/api/auth/oauth/google'
  //   try {
  //     const url = await getGoogleAuthURL();
  //     router.push(url)
  //   } catch (error: any) {
  //     console.log('Login failed:', error)
  //   }
  // }

  const onSubmit = (data: FormValues) => {
    console.log(data);
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
    // Promise.resolve().then(() => {
    //   toast({
    //     title: "Please fix the following errors:",
    //     variant: "destructive",
    //     description: (
    //       <ul className="list-disc pl-5">
    //         {errorMessages.map((msg, index) => (
    //           <li key={index}>{msg}</li>
    //         ))}
    //       </ul>
    //     ),
    //   });
    // });
  };

  const animationSettings = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.4, ease: "easeInOut" },
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <motion.h2
        layout
        className="text-xl font-semibold text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        Login
      </motion.h2>

      <AnimatePresence mode="wait">
        {showEmailForm ? (
          <motion.div key="email-form" {...animationSettings}>
            <Button
              variant="ghost"
              onClick={() => setShowEmailForm(false)}
              className="flex items-center gap-2 px-0 py-1 mb-4 hover:bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-3">
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
                          className={`w-full ${fieldState.invalid ? 'ring-2 ring-red-500' : ''}`}
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
                          className={`w-full ${fieldState.invalid ? 'ring-2 ring-red-500' : ''}`}
                          onFocus={handleFocus}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className={'w-full text-sm flex items-center gap-2'}>
                  <p>Don&apos;t have an account?{" "}</p>
                  <Link href="/register" className="hover:underline">Create a new one</Link>
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div key="auth-buttons" {...animationSettings} className="space-y-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setShowEmailForm(true)}
            >
              <Mail className="h-4 w-4" />
              Continue with Email
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
