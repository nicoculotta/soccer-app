"use client";

import * as z from "zod";

export const matchSchema = z.object({
  username: z.string().min(2).max(50),
});
