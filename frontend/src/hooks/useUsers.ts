import { useState, useEffect } from "react";
import type { User } from "../types/User";
import { apiRequest } from "../lib/rest";

async function fetchAllUsers(): Promise<User[]> {
  return apiRequest<User[]>("/api/users");
}

function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
}

export default useUsers;
