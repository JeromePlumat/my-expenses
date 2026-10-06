import { db } from "../prisma/db.ts";
import { type User } from "../types/user.ts";

export class UsersService {

  public static async getUsers(): Promise<User[]> {
    try {
      const rows = await db.orm.public.User.all();
      const users = rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        bankAccount: row.bankAccount,
      }));
      return users;
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }
  
}