/**
 * A simple component to display an expense item
 */

import type { Expense } from "../types/Expense";

interface ExpenseItemProps {
  expense: Expense;
}

function ExpenseItem({ expense }: ExpenseItemProps) {
  return <div>
    <h3>Expense {expense.id}</h3>
    <p>Date: {expense.date}</p>
    <p>Description: {expense.description}</p>
    {/* amount must be restricted to 2 decimal places */}
    <p>Amount: {expense.amount.toFixed(2)}</p>
    <p>Payer: {expense.payer.name}</p>
    <p>Participants: {expense.participants.map(p => p.name).join(', ')}</p>
    {expense.category && <p className="text-sm text-gray-500" style={{ color: expense.category.colour }}>Category: {expense.category.name}</p>}
  </div>;
}

export default ExpenseItem;