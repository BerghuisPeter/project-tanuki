import { UserRole, UserStatus } from "../../../openApi/auth";
import { UserPreferences } from "../../../openApi/profile";

export interface User {
  id: string;
  email?: string;
  status?: UserStatus;
  createdAt?: string;
  roles?: Array<UserRole>;
  isGuest: boolean;
  userPreferences?: UserPreferences;
}
