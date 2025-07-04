import type { User } from "@supabase/supabase-js";

export type UserType = (User & {
  access_token?: string;
  role?: string;
  displayName?: string;
}) | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
