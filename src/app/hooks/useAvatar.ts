import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.server";

export function useAvatar(userId: string | null) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const fetchAvatar = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("usuario")
        .select("foto")
        .eq("id_usuario", userId)
        .single();

      if (error) {
        console.error("Error fetching avatar:", error.message);
        setLoading(false);
        return;
      }

      const filePath = data?.foto;

      if (filePath) {
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        if (isMounted) {
          setAvatarUrl(urlData.publicUrl || null);
        }
      }

      setLoading(false);
    };

    fetchAvatar();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { avatarUrl, loading };
}
