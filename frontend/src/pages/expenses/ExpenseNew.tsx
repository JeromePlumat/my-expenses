import ExpenseAdd from "../../components/ExpenseAdd";
import ExpenseReset from "../../components/ExpenseReset";
import useExpenses from "../../hooks/useExpenses";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const ExpenseNew = () => {
  const { addExpense, resetExpenses } = useExpenses();
  return (
    <>
      <Typography variant="h4" gutterBottom>New Expense</Typography>
      <ExpenseAdd expenseAdd={addExpense} />
      <Divider sx={{ my: 4 }} />
      <ExpenseReset onReset={resetExpenses} />
    </>
  );
};

export default ExpenseNew;
