import { useState } from "preact/hooks";

type Entry = {
  type: "note" | "project";
  slug: string;
  title: string;
  created: string;
  tags: string[];
};

type Props = {
  entries: Entry[];
};

export default function Search({ entries }: Props) {
  const [query, setQuery] = useState("");

  const filtered = entries.filter((entry) => {
    const q = query.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const notes = filtered.filter((e) => e.type === "note");
  const projects = filtered.filter((e) => e.type === "project");

  return (
    <div>
      <input
        type="text"
        placeholder="제목 또는 태그를 입력하세요"
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
        class="border px-3 py-2 rounded w-full mb-6 shadow"
      />

      {projects.length > 0 && (
        <>
          <h2 class="text-xl font-semibold text-lessernavy mt-6 mb-2">📂 프로젝트</h2>
          <ul class="grid gap-4">
            {projects.map((p) => (
              <li class="border p-3 rounded shadow hover:shadow-md">
                <a href={`/projects/${p.slug}`} class="text-lg font-bold text-mint hover:underline">
                  {p.title}
                </a>
                <p class="text-sm text-gray-500">{p.created}</p>
                <div class="flex flex-wrap gap-2 mt-1">
                  {p.tags.map((tag) => (
                    <span class="text-xs bg-champagne px-2 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {notes.length > 0 && (
        <>
          <h2 class="text-xl font-semibold text-lessernavy mt-8 mb-2">📝 노트</h2>
          <ul class="grid gap-4">
            {notes.map((n) => (
              <li class="border p-3 rounded shadow hover:shadow-md">
                <a href={`/notes/${n.slug}`} class="text-lg font-bold text-mint hover:underline">
                  {n.title}
                </a>
                <p class="text-sm text-gray-500">{n.created}</p>
                <div class="flex flex-wrap gap-2 mt-1">
                  {n.tags.map((tag) => (
                    <span class="text-xs bg-champagne px-2 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {filtered.length === 0 && query && (
        <p class="text-gray-500 text-sm mt-4">🔎 일치하는 결과가 없습니다.</p>
      )}
    </div>
  );
}