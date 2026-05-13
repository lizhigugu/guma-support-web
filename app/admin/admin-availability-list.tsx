"use client";

import { useMemo, useState } from "react";

import { updateSupportAvailability } from "@/app/admin/actions";
import type { AdminSupportItem } from "@/lib/admin-supports";

type Props = Readonly<{
  initialSupports: AdminSupportItem[];
}>;

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function getStatusLabel(isAvailable: boolean): string {
  return isAvailable ? "可領取" : "不可領取";
}

export function AdminAvailabilityList({ initialSupports }: Props) {
  const [supports, setSupports] = useState(initialSupports);
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const groupedSupports = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    const filtered = normalizedQuery
      ? supports.filter((support) =>
          [
            support.title_zh,
            support.organizer_zh,
            support.category,
            getStatusLabel(support.is_available),
          ]
            .join("\n")
            .toLowerCase()
            .includes(normalizedQuery),
        )
      : supports;

    const groups = new Map<string, AdminSupportItem[]>();
    for (const support of filtered) {
      const title = support.title_zh || "未命名應援物";
      const group = groups.get(title) ?? [];
      group.push(support);
      groups.set(title, group);
    }

    return Array.from(groups.entries());
  }, [query, supports]);

  async function handleToggle(support: AdminSupportItem) {
    const nextAvailability = !support.is_available;
    const nextLabel = getStatusLabel(nextAvailability);
    const organizer = support.organizer_zh || "未填寫";
    const confirmed = window.confirm(
      `是否確認變更${support.title_zh}(主辦人${organizer})的領取狀態為${nextLabel}？`,
    );

    if (!confirmed) return;

    setSavingId(support.id);
    setMessage(null);

    try {
      const updated = await updateSupportAvailability(
        support.id,
        nextAvailability,
      );
      setSupports((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setMessage(
        `已更新 ${updated.title_zh}（主辦人 ${updated.organizer_zh || "未填寫"}）為${getStatusLabel(updated.is_available)}。`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "更新失敗，請稍後再試。");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-orange-100 bg-white p-4 shadow-hle-card">
        <label
          htmlFor="admin-support-search"
          className="text-sm font-medium text-neutral-700"
        >
          搜尋應援物名稱或主辦人中文名字
        </label>
        <input
          id="admin-support-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="輸入名稱、主辦人或狀態"
          className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-hle-orange focus:ring-2 focus:ring-hle-orange/20"
        />
      </div>

      {message ? (
        <p className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-neutral-700">
          {message}
        </p>
      ) : null}

      {groupedSupports.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center text-sm text-neutral-500">
          找不到符合條件的應援物。
        </p>
      ) : (
        groupedSupports.map(([title, items]) => (
          <section
            key={title}
            className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-hle-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 bg-orange-50/70 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  {title}
                </h2>
                <p className="text-xs text-neutral-500">
                  {items.length} 筆主辦人資料
                </p>
              </div>
            </div>

            <div className="divide-y divide-neutral-100">
              {items.map((support) => {
                const isSaving = savingId === support.id;
                return (
                  <div
                    key={support.id}
                    className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-neutral-900">
                        主辦人：{support.organizer_zh || "未填寫"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        分類：{support.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-medium ${
                          support.is_available
                            ? "text-emerald-700"
                            : "text-neutral-500"
                        }`}
                      >
                        {getStatusLabel(support.is_available)}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={support.is_available}
                        disabled={isSaving}
                        onClick={() => handleToggle(support)}
                        className={`relative h-8 w-14 rounded-full transition ${
                          support.is_available
                            ? "bg-emerald-500"
                            : "bg-neutral-300"
                        } ${isSaving ? "cursor-wait opacity-60" : "cursor-pointer"}`}
                      >
                        <span
                          className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                            support.is_available
                              ? "translate-x-6"
                              : "translate-x-0"
                          }`}
                        />
                        <span className="sr-only">
                          切換 {support.title_zh} 的領取狀態
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </section>
  );
}
