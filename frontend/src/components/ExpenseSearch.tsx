import { useForm } from "react-hook-form";
import type { ExpenseFilter } from "../hooks/useExpenses";

function ExpenseSearch({ searchExpenses }: { searchExpenses: (filter?: ExpenseFilter) => Promise<void> }) {
  const { register, handleSubmit } = useForm<ExpenseFilter>();
  const onSubmit = async (data: ExpenseFilter) => {
    console.log("Searching for expenses with filter:", data);
    await searchExpenses(data);
  };
  return <div>
    <h3>Search expenses</h3>
    <p>Search by amount</p>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="number" placeholder="Search by amount" {...register("amount")} />
      <button type="submit">Search</button>
    </form>
    <p>Search by payer</p>
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="payerId">Payer ID</label>
      <input type="text" placeholder="Search by payer" {...register("payerId")} />
      {/*TODO: dropdown menu with all the users*/}
      <button type="submit">Search</button>
    </form>
  </div>;
}

export default ExpenseSearch;