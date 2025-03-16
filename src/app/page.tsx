import NavigationCard from "@/components/app/home/navigation-card";

export default function Home() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-primary">RuneSync</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and compare Group Ironman progress effortlessly.
          </p>
        </header>

        <NavigationCard />
      </div>
  );
}