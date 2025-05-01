'use client'

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Pencil } from 'lucide-react';

interface FotoPerfilProps {
  userId: string;
}

export default function FotoPerfil({ userId }: FotoPerfilProps) {
  const [url, setUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfilePicture = async () => {
    const { data, error } = await supabase.storage
      .from('fotosperfil')
      .createSignedUrl(`${userId}/profile.jpg`, 60);

    if (error) {
      setUrl(null);
    } else {
      setUrl(data?.signedUrl || null);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const { error } = await supabase
      .storage
      .from('fotosperfil')
      .upload(`${userId}/profile.jpg`, file, {
        upsert: true,
        contentType: file.type,
      });

    if (!error) fetchProfilePicture();
  };

  useEffect(() => {
    fetchProfilePicture();
  }, [userId]);

  console.log("User ID en FotoPerfil:", userId);
 console.log("URL imagen:", url);

  return (
    <section className="flex flex-row gap-6 border-b border-gray-500 pb-4">
    <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-white shadow-md">
      <img
        src={url || '/placeholder_profile.png'}
        alt="Foto de perfil"
        className="rounded-full object-cover w-full h-full border border-gray-600"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-1 right-1 bg-white p-1 rounded-full hover:bg-gray-200"
      >
        {/**<Pencil size={32} className="text-white" /> */}
        <Pencil className="text-slate-600 hover:text-slate-800 w-4 h-4" />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
    </section>
  );
}