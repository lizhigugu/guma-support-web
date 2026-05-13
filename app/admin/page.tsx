import type { Metadata } from "next";

import { loginAdmin, logoutAdmin } from "@/app/admin/actions";
import { AdminAvailabilityList } from "@/app/admin/admin-availability-list";
import {
  isAdminAuthenticated,
  isAdminPasswordConfigured,
} from "@/lib/admin-auth";
import { getAdminSupportItems } from "@/lib/admin-supports";
import type { AdminSupportItem } from "@/lib/admin-supports";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "應援物後台管理",
};

type Props = Readonly<{
  searchParams?: Record<string, string | string[] | undefined>;
}>;

function getErrorMessage(error: string | string[] | undefined): string | null {
  if (error === "invalid-password") {
    return "管理密碼不正確，請再試一次。";
  }

  return null;
}

function LoginView({ error }: Readonly<{ error: string | null }>) {
  const isConfigured = isAdminPasswordConfigured();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16 font-noto-tc">
      <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-hle-card">
        <p className="text-sm font-medium text-hle-orange">GUMA Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
          應援物後台管理
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          登入後可以編輯每個應援物的「可領取」狀態。
        </p>

        {!isConfigured ? (
          <p className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            尚未設定 ADMIN_PASSWORD，請先在 Vercel 環境變數新增管理密碼。
          </p>
        ) : null}

        {error ? (
          <p className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <form action={loginAdmin} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-neutral-700"
            >
              管理密碼
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={!isConfigured}
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-hle-orange focus:ring-2 focus:ring-hle-orange/20 disabled:bg-neutral-100"
            />
          </div>
          <button
            type="submit"
            disabled={!isConfigured}
            className="w-full rounded-2xl bg-hle-orange px-4 py-3 text-sm font-semibold text-white transition hover:bg-hle-orange-hover disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            登入管理
          </button>
        </form>
      </section>
    </main>
  );
}

export default async function AdminPage({ searchParams = {} }: Props) {
  const error = getErrorMessage(searchParams.error);
  const isAuthed = await isAdminAuthenticated();

  if (!isAuthed) {
    return <LoginView error={error} />;
  }

  let supports: AdminSupportItem[];
  let loadError: string | null = null;

  try {
    supports = await getAdminSupportItems();
  } catch (error) {
    supports = [];
    loadError =
      error instanceof Error
        ? error.message
        : "讀取資料失敗，請確認 Supabase 環境變數設定。";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-orange-50/40 to-white px-6 py-10 font-noto-tc">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-hle-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-hle-orange">GUMA Admin</p>
            <h1 className="mt-1 text-2xl font-semibold text-neutral-900">
              領取狀態管理
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              只會更新 Supabase `supports.is_available`，其他欄位不會被更動。
            </p>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-hle-orange hover:text-hle-orange"
            >
              登出
            </button>
          </form>
        </header>

        {loadError ? (
          <p className="rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {loadError}
          </p>
        ) : (
          <AdminAvailabilityList initialSupports={supports} />
        )}
      </div>
    </main>
  );
}
