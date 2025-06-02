import type { DayOfWeek } from './usebeforeTimecard';
import type { ModalProps as ModalData } from '../Modal';

/**
 * Props required by the useWeekNavigation hook
 */
type UseWeekNavigationProps = {
  week: DayOfWeek[];
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  editing: { [iso: string]: number | null };
  setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
  isWeekClean: () => boolean;
  cancelEdit: (iso: string) => void;
  setExpanded: React.Dispatch<React.SetStateAction<{ [index: number]: boolean }>>;
};

/**
 * Custom hook that provides navigation logic for changing the week
 * and toggling daily expand/collapse behavior.
 */
export function useWeekNavigation({
  week,
  startDate,
  setStartDate,
  editing,
  setModal,
  isWeekClean,
  cancelEdit,
  setExpanded,
}: UseWeekNavigationProps) {

  /**
   * Changes the current week by shifting the base date by the specified number of days.
   * Prevents week change if any edits are in progress or there are unsaved changes.
   */
  const changeWeek = (days: number) => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes cambiar de semana mientras estás editando.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    if (!isWeekClean()) {
      setModal({
        title: 'Advertencia',
        message: 'Antes de cambiar de semana, debes guardar los cambios.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + days);
    setStartDate(newDate);
    setExpanded({});
  };

  /**
   * Toggles the expansion state for a day's section.
   * Automatically cancels any edits in progress for that day.
   */
  const toggleExpand = (index: number) => {
    const iso = week[index]?.iso;
    const isEditingThisDay = editing[iso] !== null && editing[iso] !== undefined;
    if (isEditingThisDay) {
      cancelEdit(iso);
    }

    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return { changeWeek, toggleExpand };
}
