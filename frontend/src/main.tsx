import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

import './index.css'
import Layout from './pages/Layout.tsx'
import Welcome from './pages/Welcome.tsx'
import ExpenseList from './pages/expenses/ExpenseList.tsx'
import ExpenseNew from './pages/expenses/ExpenseNew.tsx'
import ExpenseShow from './pages/expenses/ExpenseShow.tsx'
import { expenseListLoader } from './pages/expenses/ExpenseList.loader.ts'

const theme = createTheme();

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {index: true, Component: Welcome},
      {path: "/expenses", Component: ExpenseList, loader: expenseListLoader},
      {path: "/expenses/new", Component: ExpenseNew},
      {path: "/expenses/:id", Component: ExpenseShow},
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
