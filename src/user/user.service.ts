import { Injectable } from '@nestjs/common';
import db from '../kysely-config'; // Ensure correct path to kysely-config
import { NewUser, UserTable } from './user.model';

@Injectable()
export class UsersService {
  // Add a user to the database
  async addUser(userData: Omit<NewUser, 'id' | 'created_at'>): Promise<UserTable> {
    const createdAt: string = new Date().toISOString(); // Format to ISO string
    const newUser = await this.createUser({
      ...userData,
      created_at: createdAt,
    });

    return newUser; // Return the newly created user object directly
  }

  // Remove a user by userId from the database
  async removeUser(userId: number) {
    await db.deleteFrom('users').where('id', '=', userId).execute();
    return { message: 'User removed successfully' };
  }

  // Find a user by sub
  async findUserBySub(sub: string): Promise<UserTable | null> {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('sub', '=', sub)
      .executeTakeFirst(); // Returns the first matching user or undefined

    if (!user) return null; // Return null if no user found

    // Cast the result to UserTable
    return {
      id: user.id as number, // Assuming id can be a Generated type
      created_at: user.created_at.toDateString(), // Use toDateString() to avoid time details
      email: user.email,
      sub: user.sub,
    };
  }

  // Create a new user in the database
  private async createUser(userData: Omit<UserTable, 'id'>) {
    const newUserData = {
      ...userData,
      created_at: new Date().toISOString(), // Format the date as an ISO string
    };

    const [newUser] = await db
      .insertInto('users')
      .values(newUserData)
      .returning(['id', 'email', 'sub', 'created_at']) // Specify the columns you want back
      .execute();

    return {
      ...newUser,
      created_at: typeof newUser.created_at === 'string' ? newUser.created_at : newUser.created_at.toISOString(), // Ensure created_at is a string
    };
  }
}