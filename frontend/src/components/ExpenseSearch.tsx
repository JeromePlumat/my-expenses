import { useForm } from "react-hook-form";

function ExpenseSearch({ fetchAllExpenses }: { fetchAllExpenses: (filter?: any) => Promise<any> }) {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data: any) => {
    await fetchAllExpenses(data);
  };
  return <div>
    <h3>Search expenses</h3>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="number" placeholder="Search by amount" {...register("amount")} />
      <button type="submit">Search</button>
    </form>
  </div>;
}

export default ExpenseSearch;