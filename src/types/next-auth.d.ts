import { DefaultSession } from "next-auth";
import "next-auth";

declare module "next-auth" {
  interface session {
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}
