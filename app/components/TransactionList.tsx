type Transaction = {
    id: number;
    name: string;
    date: string;
    category: string;
    amount: number;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
};

/* ── SVG Icons ────────────────────────────────────── */
const RestaurantIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const ShoppingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

const transactions: Transaction[] = [
    {
        id: 1,
        name: "Starbucks Coffee",
        date: "Today, 09:41 AM",
        category: "Food",
        amount: -55000,
        icon: <RestaurantIcon />,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        iconColor: "text-orange-600",
    },
    {
        id: 2,
        name: "Monthly Rent",
        date: "Yesterday",
        category: "Housing",
        amount: -12000000,
        icon: <HomeIcon />,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600",
    },
    {
        id: 3,
        name: "Salary Deposit",
        date: "Aug 15",
        category: "Income",
        amount: 30000000,
        icon: <WalletIcon />,
        iconBg: "bg-primary/20",
        iconColor: "text-primary",
    },
    {
        id: 4,
        name: "Amazon.com",
        date: "Aug 14",
        category: "Shopping",
        amount: -842000,
        icon: <ShoppingIcon />,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600",
    },
];

function formatAmount(amount: number) {
    const abs = Math.abs(amount).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return amount >= 0 ? `+${abs}` : `-${abs}`;
}

export default function TransactionList() {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold dark:text-white">Recent Transactions</h2>
                <button className="text-primary text-sm font-bold active:opacity-70 transition-opacity">
                    See All
                </button>
            </div>

            <div className="space-y-3">
                {transactions.map((tx) => (
                    <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark transition-transform active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`size-10 rounded-lg ${tx.iconBg} ${tx.iconColor} flex items-center justify-center`}
                            >
                                {tx.icon}
                            </div>
                            <div>
                                <p className="text-sm font-bold dark:text-white">{tx.name}</p>
                                <p className="text-[11px] text-muted">
                                    {tx.date} • {tx.category}
                                </p>
                            </div>
                        </div>

                        <p
                            className={`text-sm font-extrabold ${tx.amount >= 0 ? "text-primary" : "text-expense-red"
                                }`}
                        >
                            {formatAmount(tx.amount)}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
