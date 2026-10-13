import { useForm } from "react-hook-form";
import type { ExpenseFilter } from "../hooks/useExpenses";
import useUsers from "../hooks/useUsers";
import useCategories from "../hooks/useCategories";
import { useSearchParams } from "react-router";

function ExpenseSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { register, handleSubmit } = useForm<ExpenseFilter>({
    defaultValues: {
      amount: searchParams.get("amount") ? Number(searchParams.get("amount")) : undefined,
      payerId: searchParams.get("payerId") || undefined,
      categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
    },
  });
  const { users } = useUsers();
  const { categories } = useCategories();

  const onSubmit = async (data: ExpenseFilter) => {
    // Only the filters the user actually filled in go into the URL.
    const filter: Record<string, string> = {};
    if (data.amount) filter.amount = String(data.amount);
    if (data.payerId) filter.payerId = data.payerId;
    if (data.categoryId) filter.categoryId = String(data.categoryId);

    setSearchParams(filter);
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

        <label htmlFor="categoryId">Category</label>
        <select id="categoryId" {...register("categoryId")}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default ExpenseSearch;
