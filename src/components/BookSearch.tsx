import axios from "axios";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  type SearchResult = {
    docs: any[];
    numFound: number;
  };

  const searchBooks = async () => {
    if (!query) return;

    setIsLoading(true);
    try {
      const response = await axios.get<SearchResult>(
        `https://openlibrary.org/search.json?q=${query}`
      );
      setResults(response.data.docs);
    } catch (error) {
      console.log("Error fetching OpenLibrary API data", error);
    }
    setIsLoading(false);
  };
  return (
    <div className="p-4">
      <div className="sm:max-w-xs">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søk etter din neste bok!"
        />
      </div>
      <Button onClick={() => searchBooks()}>
        {isLoading ? "Søker..." : "Søk"}
      </Button>
      <div className="mt-4 max-h-64 overflow-auto">
        <ul>
          {results.map((book, index) => (
            <li key={index}>{JSON.stringify(book, null, 2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
