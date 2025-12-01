import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handle = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/category/${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handle} style={{ display: 'inline' }}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={e => setQuery(e.target.value.toLowerCase())}
      />
      <button type="submit">Go</button>
    </form>
  );
};

export default SearchBar;
