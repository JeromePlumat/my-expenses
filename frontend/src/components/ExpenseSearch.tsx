import { useForm } from "react-hook-form";
import type { ExpenseFilter } from "../hooks/useExpenses";

function ExpenseSearch({ searchExpenses }: { searchExpenses: (filter?: ExpenseFilter) => Promise<void> }) {
  const { register, handleSubmit } = useForm<ExpenseFilter>();
  const onSubmit = async (data: ExpenseFilter) => {
    await searchExpenses(data);
  };
  return <div>
    <h3>Search expenses</h3>
    <p>Search by amount</p>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="number" placeholder="Search by amount" {...register("amount")} />
      <button type="submit">Search</button>
    </form>
  </div>;
}

export default ExpenseSearch;