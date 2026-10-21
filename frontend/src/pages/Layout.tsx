import { NavLink, Outlet } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useAuth } from "../contexts/AuthContext";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/expenses", label: "Expenses", end: true },
  { to: "/expenses/new", label: "New Expense", end: true },
];

function Layout() {
  const { user } = useAuth();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Expenses App
          </Typography>
          {user && (
            <Typography variant="body2" sx={{ mr: 2, opacity: 0.85 }}>
              {user.email}
            </Typography>
          )}
          <Box>
            {navLinks.map(({ to, label, end }) => (
              <Button
                key={to}
                component={NavLink}
                to={to}
                end={end}
                color="inherit"
                sx={{
                  "&.active": { textDecoration: "underline", fontWeight: "bold" },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}

export default Layout;
