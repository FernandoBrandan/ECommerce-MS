import { User } from "./userModel"

export const createUser = async (name: string, email: string, phoneNumber: string, password: string) => {
    const duplicate = await User.findAll({ where: { email } })
    if (duplicate.length !== 0) return { error: true, message: "User already exists", res: [] }

    return await User.create({ name, email, phoneNumber, password })
}

export const getUser = async (email: string) => {
    return await User.findOne({ where: { email } })
}