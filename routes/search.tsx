import { Handlers, PageProps } from "$fresh/server.ts";
import { useState } from "preact/hooks";
import { extract } from "$std/front_matter/yaml.ts";
import { basename } from "$std/path/mod.ts";
import Layout from "../components/Layout.tsx";
import Search from "../islands/Search.tsx";

type Entry = {
    type: "note" | "project";
    slug: string;
    title: string;
    created: string;
    tags: string[];
};

export const handler: Handlers<Entry[]> = {
    async GET(_, ctx) {
        const result: Entry[] = [];

        const sources = [
            { dir: "content/notes", type: "note" },
            { dir: "content/projects", type: "project" },
        ];

        for (const {dir, type} of sources) {
            for await (const entry of Deno.readDir(dir)) {
                if (!entry.name.endsWith(".md")) continue;

                const text = await Deno.readTextFile(`${dir}/${entry.name}`);
                const { attrs } = extract(text);
                if (attrs.published !== true) continue;

                result.push({
                    type,
                    slug: basename(entry.name, ".md"),
                    title: attrs.title as string ?? entry.name,
                    created: attrs.created as string ?? "",
                    tags: attrs.tags as string[] ?? [],
                });
            }
        }

        return ctx.render(result);
    },
};

export default function SearchPage({ data }: PageProps<Entry[]>) {
    // const [query, setQuery] = useState("");
    
    // const filtered = data.filter((entry) =>{
    //     const q = query.toLowerCase();
    //     return (
    //         entry.title.toLowerCase().includes(q) ||
    //         entry.tags.some((tag) => tag.toLowerCase().includes(q))
    //     )
    // });

    // const notes = filtered.filter((entry) => entry.type === "note");
    // const projects = filtered.filter((entry) => entry.type === "project");

    return (
        <Layout>
            <h1 class="text-3xl font-bold mb-4">🔍 검색</h1>
            <Search entries={data}/>
            
        </Layout>
        
    );
};