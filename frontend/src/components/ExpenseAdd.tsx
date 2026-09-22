import type { NewExpense } from "../types/Expense";

interface ExpenseAddProps {
    expenseAdd: (expense: NewExpense) => Promise<void>;
}

function ExpenseAdd({ expenseAdd }: ExpenseAddProps) {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const description = (e.target as HTMLFormElement).elements.namedItem("description") as HTMLInputElement;
    const payer = (e.target as HTMLFormElement).elements.namedItem("payer") as HTMLInputElement;
    const amount = (e.target as HTMLFormElement).elements.namedItem("amount") as HTMLInputElement;
    const date = (e.target as HTMLFormElement).elements.namedItem("date") as HTMLInputElement;
    const newExpense: NewExpense = {
        description: description.value,
        payer: payer.value,
        amount: parseFloat(amount.value),
        date: date.value,
    };
    expenseAdd(newExpense);
  };

  return <div>
    <h2>Add expense</h2>
    <form onSubmit={handleSubmit}>
        <input type="text" name="description" placeholder="Description" />
        <input type="text" name="payer" placeholder="Payer" />
        <input type="number" name="amount" placeholder="Amount" />
        <input type="date" name="date" placeholder="Date" />
        <button type="submit" className="btn btn-primary">Add</button>
    </form>
  </div>;
}

export default ExpenseAdd;