export default function Footer() {
    return(
        <footer class="w-full px-6 py-4 text-sm text-center border-t border-gray-200 mt-12 text-lessernavy bg-white">
            <p>© {new Date().getFullYear()} LESSERNALSA. All rights reserved.</p>
            <p class="mt-1">
                <a 
                    href="https://github.com/LesserNalsa/lessernalsa-portfolio-publisher"
                    class="underline hover:text-mint transition"
                    target="_blank"
                >
                    GitHub Repository
                </a>
            </p>
        </footer>
    );
}