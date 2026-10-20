import { createSchema } from 'graphql-yoga';
import { ExpensesService } from '../services/expenses.service.ts';
import { UsersService } from '../services/users.service.ts';
import { CategoriesService } from '../services/categories.service.ts';

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
  type User {
    id: Int!
    name: String!
    email: String!
    bankAccount: String!
  }

  type Category {
    id: Int!
    name: String!
    colour: String!
  }

  type Expense {
    id: Int!
    description: String!
    amount: Float!
    date: String!
    payer: User!
    participants: [User!]!
    category: Category
  }

  input ExpenseFilter {
    amount: Float
    payerId: Int
    categoryId: Int
  }

  type Query {
    expenses(filter: ExpenseFilter): [Expense!]!
    expense(id: Int!): Expense
    users: [User!]!
    categories: [Category!]!
  }
  
  input CreateExpenseInput {
      description: String!
      amount: Float!
      date: String!
      payerId: Int!
      participants: [Int!]!
      categoryId: Int
    }

    type Mutation {
      createExpense(input: CreateExpenseInput!): Expense!
    }
  `,
  resolvers: {
    Expense: {
      date: (expense: { date: unknown }) => String(expense.date),
    },
    Query: {
      expenses: (_parent: unknown, args: { filter?: { amount?: number; payerId?: number; categoryId?: number } }) => ExpensesService.getExpenses(args.filter ?? {}),
      expense: (_parent: unknown, args: { id: number }) => ExpensesService.getById(args.id),
      users: () => UsersService.getUsers(),
      categories: () => CategoriesService.getCategories(),
    },
    Mutation: {
      createExpense: (_parent, args) => {
        const newExpense = args.input;
        if (newExpense === false) {
          throw new Error("Invalid input expense");
        }
        return ExpensesService.addExpense(newExpense);
      },
    },
  },
});
