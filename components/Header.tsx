export default function Header() {
    return (
        <header class="w-full px-6 py-4 flex items-center justify-between bg-white text-lessernavy shadow-md">
            <h1 class="text-xl font-bold tracking-wide">
                <a href="/" class="hover:text-mint transition">
                    LESSERNALSA
                </a>
            </h1>
            <nav class="flex gap-4 text-sm sm:text-base">
                <a href="/projects" class="hover:text-mint transition">
                    Projects
                </a>
                <a href="/notes" class="hover:text-mint transition">
                    Notes
                </a>
            </nav>
        </header>
    );
}