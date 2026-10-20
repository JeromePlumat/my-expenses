import { type Expense } from "../types/expense.ts";
import { type ExpenseDTO } from "../types/expense.ts";

export class ExpensesMapper {
  public static toDTO(expense: Expense): ExpenseDTO {
    return {
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      payer: {id: expense.payerId, name: expense.payer.name},
      category: expense.category,
    };
  }
}