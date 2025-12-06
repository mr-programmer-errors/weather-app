import { useState } from "react";

type Props = {
  onSearch: (city: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const city = value.trim();
    if (!city) return;
    onSearch(city);
    setValue("");
  };

  return (
    <form className="searchbar" onSubmit={onSubmit}>
      <input
        className="search-input"
        placeholder="Search city..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  );
}
