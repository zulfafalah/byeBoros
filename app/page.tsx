import Header from "./components/Header";
import BalanceSummary from "./components/BalanceSummary";
import QuickActions from "./components/QuickActions";
import TransactionList from "./components/TransactionList";
import BottomNav from "./components/BottomNav";

export default function Home() {
  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden max-w-[430px] mx-auto bg-background-light dark:bg-background-dark shadow-2xl">
      {/* Header */}
      <Header />

      {/* Main Content (Scrollable) */}
      <main className="flex-1 overflow-y-auto px-6 pb-28 scrollbar-hide">
        <BalanceSummary />
        <QuickActions />
        <TransactionList />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
