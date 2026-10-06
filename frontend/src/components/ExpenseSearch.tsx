import { useForm } from "react-hook-form";
import type { ExpenseFilter } from "../hooks/useExpenses";
import useUsers from "../hooks/useUsers";

function ExpenseSearch({ searchExpenses }: { searchExpenses: (filter?: ExpenseFilter) => Promise<void> }) {
  const { register, handleSubmit } = useForm<ExpenseFilter>();
  const { users } = useUsers();

  const onSubmit = async (data: ExpenseFilter) => {
    await searchExpenses(data);
  };

  return (
    <div>
      <h3>Search expenses</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="amount">Amount</label>
        <input type="number" id="amount" placeholder="Filter by amount" {...register("amount")} />

        <label htmlFor="payerId">Payer</label>
        <select id="payerId" {...register("payerId")}>
          <option value="">All payers</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default ExpenseSearch;
