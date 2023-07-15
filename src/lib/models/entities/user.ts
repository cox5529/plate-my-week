import type { Roles } from "../enums/roles";

export type AppUser = {
  id: string;
  name: string;
  role: Roles;
};
