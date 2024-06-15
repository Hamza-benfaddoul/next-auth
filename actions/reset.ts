'use server'

import * as z from 'zod'

import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import { generatePasswrodResetToken } from '@/data/tokens'
import { sendPasswordResetEmail } from '@/lib/mail'


export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {

    return { error: 'Email does not exist!' }
  }

  const passwordResetToken = await generatePasswrodResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: 'Reset email sent!' }
}
