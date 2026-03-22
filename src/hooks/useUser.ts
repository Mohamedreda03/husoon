"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/appwrite/auth";
import { useAppwrite } from "@/providers/AppwriteProvider";
import { useRouter } from "next/navigation";

export function useUser() {
  const queryClient = useQueryClient();
  const { setUser } = useAppwrite();
  const router = useRouter();

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: async () => {
      const user = await getCurrentUser();
      setUser(user);
      queryClient.setQueryData(["user"], user);
      router.push("/");
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => registerUser(email, password, name),
    onSuccess: async () => {
      const user = await getCurrentUser();
      setUser(user);
      queryClient.setQueryData(["user"], user);
      router.push("/onboarding");
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(["user"], null);
      router.push("/login");
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
  };
}
