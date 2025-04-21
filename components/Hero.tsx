export default function Hero() {
    return (
        <section class="flex flex-col items-center justify-center text-center py-24 px-6 bg-lessernavy text-champagne">
            <h1 class="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
                🐾 LESSERNALSA
            </h1>
            <p class="text-lg sm:text-xl mb-8 max-w-xl text-mint">
                작지만 날카로운 통찰,
                보이지 않지만 깊이 남는 개발자의 퍼블리셔입니다.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                <a 
                    href="/projects" 
                    class="px-6 py-2 text-lessernavy bg-champagne rounded hover:bg-lightgold font-semibold transition"
                >
                    프로젝트 보기
                </a>
                <a 
                    href="/notes"
                    class="px-6 py-2 text-champagne border border-champagne rounded hover:bg-burgundy transition"
                >
                    세컨드 브레인 보기
                </a>
            </div>
        </section>
    );
}