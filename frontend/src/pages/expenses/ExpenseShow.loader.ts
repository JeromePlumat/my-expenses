import type { LoaderFunctionArgs } from 'react-router';
import type { Expense } from '../../types/Expense';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function expenseShowLoader({ params }: LoaderFunctionArgs): Promise<Expense> {
  // 1. fetch one expense, using params.id in the URL
  const url = new URL(`${API_BASE_URL}/api/expenses/${params.id}`);
  const response = await fetch(url);
  // 2. if the response is not ok, throw a Response carrying its status
  if (!response.ok) {
    throw new Response('Could not load expense', { status: response.status });
  }
  // 3. return the parsed JSON
  return response.json();
}