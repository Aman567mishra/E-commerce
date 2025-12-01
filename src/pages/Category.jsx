import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import StackCardCollection from '../components/StackCardCollection';

const Category = () => {
  const { name } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const q = query(collection(db, 'products'), where('category', '==', name));
      const snap = await getDocs(q);
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetch();
  }, [name]);

  if (loading) return <div>Loading…</div>;

  return (
    <>
    <div style={{ padding: '1rem' }}>
      <h1>Category: {name}</h1>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '1rem' }}>
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
    <StackCardCollection />
    </>
  );
};

export default Category;
