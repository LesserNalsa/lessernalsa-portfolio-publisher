import { Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import { basename } from "$std/path/mod.ts";
import Layout from "../../components/Layout.tsx";

type NoteMeta = {
    slug: string;
    title: string;
    created: string;
    tags: string[];
};

type Data = {
    notes: NoteMeta[];
    selectedTag: string | null;
};

export const handler: Handlers<Data> = {
    async GET(req, ctx) {
        const tag = new URL(req.url).searchParams.get("tag");

        const notesDir = "content/notes";
        const notes: NoteMeta[] = [];

        for await (const entry of Deno.readDir(notesDir)) {
            if (!entry.name.endsWith(".md")) continue;
            
            const text = await Deno.readTextFile(`${notesDir}/${entry.name}`);
            const { attrs } = extract(text);
            if (attrs.published !== true) continue;

            const tags = attrs.tags as string[] ?? [];

            if (tag && !tags.includes(tag)) continue;

            notes.push({
                slug: basename(entry.name, ".md"),
                title: attrs.title as string ?? entry.name,
                created: attrs.created as string ?? "",
                tags,
            });
        }

        return ctx.render({ notes, selectedTag: tag });
    },
};

export default function NotesPage({ data}: PageProps<Data>) {
    const { notes, selectedTag } = data;

    return (
        <Layout>
            <h1 class="text-3xl font-bold mb-6">📚 퍼블리싱된 노트</h1>
            {selectedTag && (
                <div class="mb-4">
                    <span class="mb-4 text-gray-600">Tag: </span>
                    <span class="inline-block bg-mint text-white px-2 py-0.5 rounded text-sm font-medium">{selectedTag}</span>
                    <a href='/notes' class="ml-4 text-sm text-blue-500 underline">모두 보기</a>
                </div>
            )}

            <ul class="grid gap-6">
                {notes.map((note) => (
                    <li class="p-4 border rounded shadow hover:shadow-md transition">
                        <a href={`/notes/${note.slug}`} class="text-lx font-semibold text-lessernavy hover:text-mint">
                            {note.title}
                        </a>
                        <p class="text-sm text-gray-500 mt-1">{note.created}</p>
                        <div class="flex flex-wrap gap-2 mt-2">
                            {note.tags.map((tag) =>  (
                                <a 
                                    href={`/notes?tag=${encodeURIComponent(tag)}`}
                                    class="bg-champagne text-sm px-2 py-0.5 rounded text-gray-800 hover:bg-yellow-200"
                                >
                                #{tag}
                                </a>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </Layout>
        // <main class="p-8 max-w-3xl mx-auto">
            
        // </main>
    );
}