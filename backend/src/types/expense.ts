import { type User } from "./user.ts";
import { type Category } from "./category.ts";


export interface Expense {
  id: number;
  date: string;
  description: string;
  payerId: number;
  payer: User;
  amount: number;
  participants: User[];
  categoryId?: number;
  category?: Category;
}

export interface ExpenseDTO {
  id: number;
  date: string;
  description: string;
  payer: {id: number, name: string};
  amount: number;
  category?: Category;
}

export type NewExpense = Omit<Expense, 'id'>;

export type ExpenseFilter = {
  amount?: number;
  payerId?: number;
  categoryId?: number;
};
