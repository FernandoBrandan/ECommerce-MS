import { RegisterUserDto, UserEntity } from '../';

export abstract class UserRepository {
  abstract findUserById(id: string): Promise<UserEntity | null>;
  abstract findUserByEmail(email: string): Promise<UserEntity | null>;
  abstract createUser(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
