import { z } from "zod";






export const usernameValidation=z
        .string()
        .min(3,"Username must be at least 3 characters long")
        .max(20,"Username must be at most 20 characters long")
        .regex(/^[a-zA-Z0-9]+$/,"Username must contain only letters and numbers")



export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email(),
    password:z.string().min(8,{message:"Password must be at least 8 characters long"}),
   
    isAcceptingMessage:z.boolean()
})