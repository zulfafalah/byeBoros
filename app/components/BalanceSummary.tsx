export default function BalanceSummary() {
    return (
        <section className="py-8 text-center">
            <p className="text-muted text-sm font-medium mb-1">Today&apos;s Balance</p>

            <h1 className="text-[36px] font-extrabold tracking-tight leading-tight dark:text-white">
                Rp12.450.000
            </h1>

            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {/* Trending up icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3.5"
                >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                </svg>
                <span>+2.4% from yesterday</span>
            </div>
        </section>
    );
}
