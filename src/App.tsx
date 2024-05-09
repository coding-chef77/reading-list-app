import { useEffect } from "react";

import { BookList } from "./components/BookList";
import { useStore } from "./store";
import { Layout } from "./components/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";

const App = () => {
  const { loadBooksFromLocalStorage } = useStore((state) => state);

  useEffect(() => {
    loadBooksFromLocalStorage();
  }, [loadBooksFromLocalStorage]);

  return (
    <Layout>
      <TooltipProvider>
        <BookList />
      </TooltipProvider>
    </Layout>
  );
};

export default App;
