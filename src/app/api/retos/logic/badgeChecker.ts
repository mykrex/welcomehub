import { Badge, BadgeUsuario } from '@/app/api/retos/types/badgeTypes';
import { RetoUsuarioStats } from '@/app/api/retos/types/retoTypes';

export function checkBadgesForUser(
  stats: RetoUsuarioStats,
  badges: Badge[],
  earned: BadgeUsuario[]
): BadgeUsuario[] {
  const newBadges: BadgeUsuario[] = [];

  for (const badge of badges) {
    const alreadyEarned = earned.some(b => b.id_badge === badge.id_badge);

    if (alreadyEarned) continue;

    const meetsCondition = (() => {
      switch (badge.condicion.tipo) {
        case 'min_streak':
          return stats.streak_record >= badge.condicion.valor;
        case 'min_puntos':
          return stats.puntos_total >= badge.condicion.valor;
        case 'retos_completados':
          return stats.retos_completados_total >= badge.condicion.valor;
        case 'primer_reto':
          return stats.retos_completados_total >= 1;
        default:
          return false;
      }
    })();

    if (meetsCondition) {
      newBadges.push({
        id_usuario: stats.id_user,
        id_badge: badge.id_badge,
        fecha_obtenido: new Date().toISOString()
      });
    }
  }

  return newBadges;
}
