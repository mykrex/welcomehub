'use client';

import React from 'react';

interface TituloProps {
  title: string;
}

export default function Titulo({ title }: TituloProps) {
  return (
    <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
      {title}
    </h2>
  );
}
