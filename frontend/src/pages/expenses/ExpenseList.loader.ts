import type { Expense } from '../../types/Expense';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function expenseListLoader(): Promise<Expense[]> {
  const response = await fetch(`${API_BASE_URL}/api/expenses`);

  if (!response.ok) {
    throw new Response('Could not load expenses', { status: response.status });
  }

  return response.json();
}