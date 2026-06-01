import * as v from "valibot"

export const LoginSchema = v.object({
    email: v.pipe(
        v.string("You must supply your email"),
        v.email("You must supply a valid email address")
    ),
    password: v.pipe(
        v.string(),
        v.minLength(3, "The password must be at least 3 characters long")
    )
})

export type Login = v.InferOutput<typeof LoginSchema>
