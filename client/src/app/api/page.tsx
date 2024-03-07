"use client"
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default async function API() {
  const { data } = await axios.get(`https://zenquotes.io/api/random`);

  const query = useSearchParams();
  const code = query.get(`code`);

  if (!code) {
    return data
  };

  return (
    <p>Omaga</p>
  );
}