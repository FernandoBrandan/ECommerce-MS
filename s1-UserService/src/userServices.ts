import { IUser } from './userInterface'
import { Utils } from './utils'
import { validateUserData, validateUserLogin } from './userValidate'
import { createUser, getUser } from './userRepository'

export const register = async (UserData: IUser) => {
    const { name, email, password } = UserData

    const validate = validateUserData(name, email, password)
    if (validate) throw Error(validate as string)

    const hash = Utils.passwordEncrypt(password)
    if (!hash) throw Error("User already exists")

    const user = await createUser(name, email, hash)
    return { message: "User created", user }
}

export const login = async (UserData: IUser) => {
    const { email, password } = UserData

    const validate = validateUserLogin(email, password)
    if (validate) throw Error(validate as string)

    const user = await getUser(email)

    const isValid = Utils.passwordDecrypt(password, user.password)
    if (!isValid) throw Error("Invalid password")

    const token = Utils.generateToken(user)
    return { message: 'User logged in', email: user.email, token }
}