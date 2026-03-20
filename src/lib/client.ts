// client.ts
import { treaty } from "@elysiajs/eden";
import type { App } from "../app/api/[[...slugs]]/route";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000" // local dev
    : "https://zero-trace-six.vercel.app/"; 

export const client = treaty<App>(BASE_URL).api;