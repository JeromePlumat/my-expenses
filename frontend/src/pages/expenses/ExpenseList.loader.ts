import type { Expense } from '../../types/Expense';
import type { LoaderFunctionArgs } from 'react-router';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function expenseListLoader({ request }: LoaderFunctionArgs): Promise<Expense[]> {
  const url = new URL(request.url);
  const queryParams = url.searchParams.toString();
  
  const response = await fetch(`${API_BASE_URL}/api/expenses${queryParams ? '?' + queryParams : ''}`);

  if (!response.ok) {
    throw new Response('Could not load expenses', { status: response.status });
  }

  return response.json();
}