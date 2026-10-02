import { useForm } from "react-hook-form";
import type { NewExpense } from "../types/Expense";

interface ExpenseAddProps {
    expenseAdd: (expense: NewExpense) => Promise<void>;
}

// Internal form shape — participants are entered as a raw comma-separated string
interface ExpenseFormValues {
  description: string;
  payerId: number;
  amount: number;
  date: string;
  participantsRaw: string;
}

function ExpenseAdd({ expenseAdd }: ExpenseAddProps) {
  const { register, handleSubmit, reset } = useForm<ExpenseFormValues>();

  const onSubmit = async (data: ExpenseFormValues) => {
    const newExpense: NewExpense = {
      description: data.description,
      payerId: data.payerId,
      amount: data.amount,
      date: data.date,
      participants: data.participantsRaw
        ? data.participantsRaw.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
        : [],
    };
    await expenseAdd(newExpense);
    reset(); // clear the form
  };

  return <div>
    <h2>Add expense</h2>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" {...register("description")} placeholder="Description" />
      <input type="number" {...register("payerId", { valueAsNumber: true })} placeholder="Payer ID" />
      <input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} placeholder="Amount" />
      <input type="date" {...register("date")} placeholder="Date" />
      <input type="text" {...register("participantsRaw")} placeholder="Participant IDs (comma-separated)" />
      <button type="submit" className="btn btn-primary">Add</button>
    </form>
  </div>;
}

export default ExpenseAdd;