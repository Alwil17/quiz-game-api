import { and, eq, isNull } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { hashPassword, verifyToken } from '../auth/session';
import { db } from '../db/drizzle';
import { User, users } from '../db/schema';
import { CreateUserDto, OUser, UpdateUserDto, UserSearchDTO } from '../types/user';


export async function getUsers(): Promise<OUser[]> {
    try {
        return await db.select({
            id: users.id,
            role: users.role, 
            name: users.name, 
            email: users.email, 
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        }).from(users);
    } catch (error) {
        console.log('ERROR::UserService.getUsers', error);
        return [];
    }
}

export async function searchUser(param: UserSearchDTO): Promise<User | null> {
    // Pour le moment, seul l'email sera utilisé pour la recherche
    try {
        const user = await db
        .select()
        .from(users)
        .where(and(eq(users.email, param.email), isNull(users.deletedAt)))
        .limit(1);
        return user[0];
    } catch (error) {
        console.log('ERROR::UserService.searchUser', error);
        return null;
    }
}

export async function getUserById(id: number): Promise<User | null> {
    try {
        const user = await db
        .select()
        .from(users)
        .where(and(eq(users.id, id), isNull(users.deletedAt)))
        .limit(1);
        return user[0];
    } catch (error) {
        console.log('ERROR::UserService.getUserById', error);
        return null;
    }
}

export async function createUser(data: CreateUserDto): Promise<OUser> {
    try {
        const pwdHash = await hashPassword(data.password);
      
        const [{passwordHash, ...user}] = await db
          .insert(users)
          .values([
            {
              email: data.email,
              passwordHash: pwdHash,
              role: data.role,
              name: data.name,
            },
          ])
          .returning();
        return user;
    } catch (error) {
        console.log('ERROR::UserService.createUser', error);
        throw error;
    }
}

export async function updateUser(id: number, data: UpdateUserDto): Promise<User | null> {
    try {
        const editUser: Partial<User> = {
            name: data.name,
            email: data.email,
            role: data.role,
        };
        if (data.password) {
            editUser.passwordHash = await hashPassword(data.password);
        }
        const [user] = <User[]>await db
            .update(users)
            .set({
                ...editUser,
                updatedAt: new Date(),
            })
            .where(eq(users.id, id));
        return user;
    } catch (error) {
        console.log('ERROR::UserService.updateUser', error);
        return null;
    }
}

export async function deleteUser(id: number): Promise<boolean> {
    try {
        const user = await getUserById(Number(id));
        const [rep] = await db
        .update(users)
        .set({
            ...user,
            deletedAt: new Date(),
        })
        .where(eq(users.id, id));
        //  const rep = await db
        //  .delete(users)
        //  .where(eq(users.id, id));
        return rep ? true : false;
    } catch (error) {
        console.log('ERROR::UserService.deleteUser', error);
        return false;
    }
}

export async function getUser(): Promise<User | null> {
    // try {
        const sessionCookie = (await cookies()).get('session');
        if (!sessionCookie || !sessionCookie.value) {
        return null;
        }
    
        const sessionData = await verifyToken(sessionCookie.value);
        if (!sessionData ||
        !sessionData.user ||
        typeof sessionData.user.id !== 'number') {
        return null;
        }
    
        if (new Date(sessionData.expires) < new Date()) {
        return null;
        }
    
        const user = await db
        .select()
        .from(users)
        .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
        .limit(1);
    
        if (user.length === 0) {
        return null;
        }
    
        return user[0];
    // } catch (error) {
    //     console.log('ERROR::UserService.getUser', error);
    //     return null;
    // }
}
