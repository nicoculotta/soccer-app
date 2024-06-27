import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SearchInput = ({
  query,
  setQuery,
  handleSearch,
}: {
  query: string;
  setQuery: (e: string) => void;
  handleSearch: () => void;
}) => {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="usuario"
        placeholder="Usuario"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" onClick={handleSearch}>
        Buscar
      </Button>
    </div>
  );
};

export default SearchInput;
