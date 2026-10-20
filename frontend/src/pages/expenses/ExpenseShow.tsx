import { useLoaderData } from "react-router";
import type { Expense } from "../../types/Expense";
import ExpenseItem from "../../components/ExpenseItem";

const ExpenseShow = () => {
    const expense = useLoaderData() as Expense;
    return (
        <div>
            <h1>Expense Show</h1>
            <ExpenseItem expense={expense} />
        </div>
    );
};

export default ExpenseShow;