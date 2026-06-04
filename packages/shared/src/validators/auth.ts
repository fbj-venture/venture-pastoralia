import { z } from "zod"

export const LoginSchema = z.object({
    email: z.string().min(1, "You must supply your email").email("You must supply a valid email address").trim().toLowerCase(),
    password: z.string().min(3, "Please supply a password")
})

export type Login = z.infer<typeof LoginSchema>
