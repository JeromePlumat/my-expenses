import type { ExpenseListItem } from '../../types/Expense';
import type { LoaderFunctionArgs } from 'react-router';
import { apiRequest } from '../../lib/rest';

export async function expenseListLoader({ request }: LoaderFunctionArgs): Promise<ExpenseListItem[]> {
  const query = new URL(request.url).searchParams.toString();
  return apiRequest<ExpenseListItem[]>(`/api/expenses${query ? '?' + query : ''}`);
}