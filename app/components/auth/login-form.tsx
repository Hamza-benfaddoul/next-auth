'use client'

import { useTransition } from 'react'

import CardWrapper from './card-wrapper'

import * as z from 'zod'
import { LoginSchema } from '@/schemas'

import { Input } from '@/components/ui/input'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'

import { login } from '@/actions/login'

const LoginFrom = () => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values)
    })
  }

  return (
    <CardWrapper
      headerLabel='Welcom back!'
      backButtonLabel="Don't have an account?"
      backButtonHref='/auth/register'
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='john.doe@example.com'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='******'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message='' />
          <FormSuccess message='' />
          <Button type='submit' disabled={isPending} className='w-full'>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginFrom
