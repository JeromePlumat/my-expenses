import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NewExpense } from "../types/Expense";
import { ExpenseFormSchema, type ExpenseFormValues } from "../types/Expense";
import useCategories from "../hooks/useCategories";
import useUsers from "../hooks/useUsers";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

interface ExpenseAddProps {
  expenseAdd: (expense: NewExpense) => Promise<void>;
}

function ExpenseAdd({ expenseAdd }: ExpenseAddProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      description: "",
      participantsRaw: "",
    },
  });
  const { categories, loading: categoriesLoading } = useCategories();
  const { users, loading: usersLoading } = useUsers();

  const onSubmit = async (data: ExpenseFormValues) => {
    const newExpense: NewExpense = {
      description: data.description,
      payerId: data.payerId,
      amount: data.amount,
      date: data.date,
      participants: data.participantsRaw
        ? data.participantsRaw.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
        : [],
      categoryId: data.categoryId,
    };
    await expenseAdd(newExpense);
    reset(); // clear the form
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        <TextField
          label="Description"
          fullWidth
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <Controller
          name="payerId"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Payer"
              fullWidth
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
              onBlur={field.onBlur}
              inputRef={field.ref}
              error={!!errors.payerId}
              helperText={errors.payerId?.message}
              disabled={usersLoading}
            >
              <MenuItem value=""><em>Select a payer</em></MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <TextField
          label="Amount"
          type="number"
          fullWidth
          slotProps={{ htmlInput: { step: "0.01", min: 0 } }}
          {...register("amount", { valueAsNumber: true })}
          error={!!errors.amount}
          helperText={errors.amount?.message}
        />

        <TextField
          label="Date"
          type="date"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register("date")}
          error={!!errors.date}
          helperText={errors.date?.message}
        />

        <TextField
          label="Participants (comma-separated IDs)"
          fullWidth
          {...register("participantsRaw")}
          error={!!errors.participantsRaw}
          helperText={errors.participantsRaw?.message}
        />

        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Category"
              fullWidth
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
              onBlur={field.onBlur}
              inputRef={field.ref}
              error={!!errors.categoryId}
              helperText={errors.categoryId?.message}
              disabled={categoriesLoading}
            >
              <MenuItem value=""><em>No category</em></MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Button type="submit" variant="contained">
          Add expense
        </Button>
      </Stack>
    </Box>
  );
}

export default ExpenseAdd;
