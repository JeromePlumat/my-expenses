import { Link } from "react-router";
import type { ExpenseListItem } from "../types/Expense";

interface ExpenseItemProps {
  expense: ExpenseListItem;
}

function ExpenseItem({ expense }: ExpenseItemProps) {
  return <div style={{border: '1px solid black', padding: '10px', marginBottom: '10px'}}>
    <h3>Expense {expense.id}</h3>
    <p>Date: {expense.date}</p>
    <p>Description: {expense.description}</p>
    {/* amount must be restricted to 2 decimal places */}
    <p>Amount: {expense.amount.toFixed(2)}</p>
    <p>Payer: {expense.payer.name}</p>
    {/* <p>Participants: {expense.participants.map(p => p.name).join(', ')}</p> */}
    {expense.category && <p className="text-sm text-gray-500" style={{ color: expense.category.colour }}>Category: {expense.category.name}</p>}
    <Link to={`/expenses/${expense.id}`}>View details</Link>
  </div>;
}

export default ExpenseItem;