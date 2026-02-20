import Link from "next/link";

export default function QuickActions() {
    return (
        <section className="grid grid-cols-2 gap-4 mb-10">
            {/* Add Income */}
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-primary text-[#131811] font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20">
                <div className="size-10 rounded-full bg-white/30 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        className="size-5"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </div>
                <span className="text-sm">Add Income</span>
            </button>

            {/* Add Expense */}
            <Link href="/expense" className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-expense-red text-white font-bold transition-transform active:scale-95 shadow-lg shadow-expense-red/20">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        className="size-5"
                    >
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </div>
                <span className="text-sm">Add Expense</span>
            </Link>
        </section>
    );
}
