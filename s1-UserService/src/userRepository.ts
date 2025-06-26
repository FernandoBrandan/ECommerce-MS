import { User } from "./userModel"

export const createUser = async (name: string, email: string, password: string) => {
    const duplicate = await User.findAll({ where: { email } })
    if (duplicate.length) throw Error("Email already exists")

    const user = await User.create({ name, email, password })
    if (!user) throw Error("Error creating user")

    return { name: user.name, email: user.email }
}

export const getUser = async (email: string) => {
    const user = await User.findOne({ where: { email } })
    if (!user) throw Error("User not found")
    return user
}