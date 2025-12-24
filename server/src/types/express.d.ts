import { Types } from "mongoose";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: "admin" | "member";
      workspaceId?: Types.ObjectId;
    }

    interface Request {
      user: User;
    }
  }
}
