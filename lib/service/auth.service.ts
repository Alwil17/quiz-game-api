import { eq, } from 'drizzle-orm';
import { comparePasswords, setSession, signToken } from '../auth/session';
import { db } from '../db/drizzle';
import { ActivityType, User, users } from '../db/schema';
import { CreateUserDto, LoginUserDTO, SignedUserDTO } from '../types/user';
import { logActivity } from '@/app/(login)/actions';
import { createUser } from './user.service';

export async function signIn (data: LoginUserDTO): Promise<SignedUserDTO | null> {
  try {
    const { email, password } = data;
  
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  
    if (!user) {
      return null;
    }
  
    const isPasswordValid = await comparePasswords(
      password,
      user.passwordHash,
    );
  
    if (!isPasswordValid) {
      return null;
    }
  
    await Promise.all([
      setSession(user),
      logActivity(1, user.id, ActivityType.SIGN_IN),
    ]);
  
    const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const session = {
        user: { id: user.id!, email: user.email },
        expires: expiresInOneDay.toISOString(),
      };
  
    const accessToken = await signToken(session);
    const { passwordHash, deletedAt, ...rest } = user;
  
    return {...rest, accessToken};
  } catch (error) {
    console.log('ERROR::AuthService.signIn', error);
    return null;
  }

};

export async function signUp (data: CreateUserDto): Promise<SignedUserDTO | null> {
    try {
        const user = <User>await createUser(data);
        if (user) {
            const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
            const session = {
                user: { id: user.id!, email: user.email },
                expires: expiresInOneDay.toISOString(),
            };
        
            const accessToken = await signToken(session as any);
            const { deletedAt, ...rest } = user;
        
            return {...rest, accessToken};
        }
        return null;
    } catch (error) {
        console.log('ERROR::AuthService.signUp', error);
        throw error;
    }
}
