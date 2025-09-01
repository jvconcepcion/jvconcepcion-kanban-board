import { Header, KanbanBoard } from './components';

export default function Home() {
  return (
    <main className="bg-blue-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Header />
      <KanbanBoard />
    </main>
  );
}
