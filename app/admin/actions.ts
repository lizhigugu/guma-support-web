"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { setSupportAvailability } from "@/lib/admin-supports";

export async function loginAdmin(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminPassword(password)) {
    redirect("/admin?error=invalid-password");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSession();
  redirect("/admin");
}

export async function updateSupportAvailability(
  supportId: string,
  isAvailable: boolean,
) {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) {
    throw new Error("管理登入已過期，請重新登入。");
  }

  const updated = await setSupportAvailability(supportId, isAvailable);
  revalidatePath("/admin");
  revalidatePath("/zh");
  revalidatePath("/en");

  return updated;
}
