import { IUser } from './userInterface'
import { Utils } from './utils'
import { validateUserData, validateUserLogin } from './userValidate'
import { createUser, getUser } from './userRepository'

export const register = async (UserData: IUser) => {
    console.log(UserData)

    const { name, email, phoneNumber, password } = UserData

    const validate = validateUserData(name, email, phoneNumber, password)
    if (validate) return { error: true, message: `Error validated data: ${validate as string}`, res: [], }

    const hash = Utils.passwordEncrypt(password)
    if (!hash) return { error: true, message: "Error encrypting password", res: [] }

    const user = await createUser(name, email, phoneNumber, hash)
    if (!user) return { error: true, message: 'Error creating user', res: [] }

    return { error: false, message: "User registered successfully", res: user }
}

export const login = async (UserData: IUser) => {
    const { email, password } = UserData

    const validate = validateUserLogin(email, password)
    if (validate) return { error: true, message: "Error validated data", res: validate as string, }

    const user = await getUser(email)
    if (!user) return { error: true, message: "User not found", res: null }

    const isValid = Utils.passwordDecrypt(password, user.password)
    if (!isValid) return { error: true, message: "Invalid email or password", res: null }

    const token = Utils.generateToken(user)
    return { error: false, message: "User logged in successfully", res: user, token }
}