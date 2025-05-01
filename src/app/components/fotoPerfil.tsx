import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function FotoPerfil({ userId }: { userId: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const ruta = `${userId}/profile.png`;

  const fetchFotoPerfil = useCallback(async () => {
    const { data } = await supabase.storage.from('avatars').download(ruta);
    if (data) {
      const url = URL.createObjectURL(data);
      setImageUrl(url);
    }
  }, [ruta]);

  useEffect(() => {
    fetchFotoPerfil();
  }, [fetchFotoPerfil]);

  return (
    <Image
    src={imageUrl || '/placeholder_profile.png'}
    alt="Foto de perfil"
    width={180}
    height={180}
    className="w-full h-full object-cover rounded-full border border-gray-400"
    />
  );
}