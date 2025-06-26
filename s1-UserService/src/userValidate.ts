import joi from "joi"
import { IUser } from "./userInterface"

const userSchema = joi.object<IUser>({
    name: joi.string().required().min(3).max(30),
    email: joi.string().required().email(),
    password: joi.string().required().min(6).max(100)
})

export const validateUserData = (name: string, email: string, password: string) => {
    const { error } = userSchema.validate({ name, email, password })
    if (error) return error.message
    return null
}


const logUserSchema = joi.object<IUser>({
    email: joi.string().required().email(),
    password: joi.string().required().min(6).max(100)
})

export const validateUserLogin = (email: string, password: string) => {
    const { error } = logUserSchema.validate({ email, password })
    if (error) return error.message
    return null
} 