// export interface IUser {
//   email: string;
//   id: number;
//   name: string | null;
//   passwordHash: string;
//   role: string;
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt: Date | null;
// }

import { User } from "../db/schema";

export interface CreateUserDto extends Omit<User, "id" | "createdAt" | "passwordHash"> {
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
export interface SignedUserDTO extends Omit<User, "passwordHash"| "deletedAt"> {
  accessToken: string;
}

export type UserSearchDTO = Pick<User, "email" | "name">;

export type UpdateUserDto = Partial<CreateUserDto>;

export type OUser = Partial<Omit<User, "passwordHash">>;
