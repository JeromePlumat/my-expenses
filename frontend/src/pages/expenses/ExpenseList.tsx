import ExpenseSorter from "../../components/ExpenseSorter";
import ExpenseSearch from "../../components/ExpenseSearch";
import ExpenseItem from "../../components/ExpenseItem";
import { useState } from "react";
import type { Expense } from "../../types/Expense";
import { useLoaderData } from "react-router";
import { Typography } from "@mui/material";

const ExpenseList = () => {
  const expenses = useLoaderData() as Expense[];
  const [sortingAlgo, setSortingAlgo] = useState<(a: Expense, b: Expense) => number>(() => () => 1);

  const handleAlgoChange = (algo: (a: Expense, b: Expense) => number) => {
    setSortingAlgo(() => algo); // We're wrapping algo in a function because useState setter accept either a value or a function returning a value.
  };

  return (
    <div>
      <Typography variant="h4" component="h2">Your expenses</Typography>
      {expenses.length > 0 && <ExpenseSorter setSortingAlgo={handleAlgoChange} />}
      {expenses.length > 0 && <ExpenseSearch />}
      
      {[...expenses ?? []].sort(sortingAlgo).map((expense) => (
          <ExpenseItem expense={expense} />
      ))}
    
    </div>
  );
};

export default ExpenseList;