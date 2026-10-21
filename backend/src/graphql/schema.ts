import { createSchema } from 'graphql-yoga';
import { ExpensesService } from '../services/expenses.service.ts';
import { UsersService } from '../services/users.service.ts';
import { CategoriesService } from '../services/categories.service.ts';
import type { GraphQLContext } from '../types/GraphQLContext.ts';
import { requireAuth } from './authHelpers.ts';
import { GraphQLError } from 'graphql';

export const schema = createSchema<GraphQLContext>({
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
      expenses: (_parent: unknown, args: { filter?: { amount?: number; payerId?: number; categoryId?: number } }, ctx) => {
        requireAuth(ctx);
        return ExpensesService.getExpenses(args.filter ?? {});
      },
      expense: async (_parent, args, ctx) => {
        const user = requireAuth(ctx);

        const expense = await ExpensesService.getById(args.id);

        if (!expense) {
          throw new GraphQLError('Expense not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Check if user is involved in this expense (as payer or participant)
        const isInvolved =
          expense.payer.id === user.userId ||
          expense.participants.some(p => p.id === user.userId);

        if (!isInvolved) {
          throw new GraphQLError("You don't have permission to view this expense", {
            extensions: { code: 'FORBIDDEN' },
          });
        }

        return expense;
      },
      users: () => UsersService.getUsers(),
      categories: () => CategoriesService.getCategories(),
    },
    Mutation: {
      createExpense: async (_parent, args, ctx) => {
        const user = requireAuth(ctx);

        // User can only create expenses where they are the payer
        if (user.userId !== args.input.payerId) {
          throw new GraphQLError('You can only create expenses that you paid for', {
            extensions: { code: 'FORBIDDEN' },
          });
        }

        const newExpense = (args.input);
        if (newExpense === false) {
          throw new GraphQLError('Invalid expense');
        }
        return ExpensesService.addExpense(newExpense);
      },
    },
  },
});
