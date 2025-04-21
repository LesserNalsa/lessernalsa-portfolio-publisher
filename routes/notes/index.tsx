import { Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import { basename } from "$std/path/mod.ts";

type NoteMeta = {
    slug: string;
    title: string;
    created: string;
    tags: string[];
};

export const handler: Handlers<NoteMeta[]> = {
    async GET(_, ctx) {
        const notesDir = "content/notes";
        const notes: NoteMeta[] = [];

        for await (const entry of Deno.readDir(notesDir)) {
            if (!entry.name.endsWith(".md")) continue;
            
            const text = await Deno.readTextFile(`${notesDir}/${entry.name}`);
            const { attrs } = extract(text);
            if (attrs.published !== true) continue;

            notes.push({
                slug: basename(entry.name, ".md"),
                title: attrs.title ?? entry.name,
                created: attrs.created ?? "",
                tags: attrs.tags ?? [],
            });
        }

        return ctx.render(notes);
    },
};

export default function NotesPage({ data}: PageProps<NoteMeta[]>) {
    return (
        <main class="p-8 max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold mb-6">📚 퍼블리싱된 노트</h1>
            <ul class="grid gap-6">
                {data.map((note) => (
                    <li class="p-4 border rounded shadow hover:shadow-md transition">
                        <a href={`/notes/${note.slug}`} class="text-lx font-semibold text-lessernavy hover:text-mint">
                            {note.title}
                        </a>
                        <p class="text-sm text-gray-500 mt-1">{note.created}</p>
                        <div class="flex flex-wrap gap-2 mt-2">
                            {note.tags.map((tag) =>  (
                                <span class="bg-champagne text-sm px-2 py-0.5 rounded text-gray-800">#{tag}</span>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}