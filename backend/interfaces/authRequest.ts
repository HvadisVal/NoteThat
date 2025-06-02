import { Request } from "express";
import { User } from "./user"; // correct relative path

export interface AuthRequest extends Request {
  user?: User;
}
