import type { DayOfWeek } from "./useBeforeTC";
import type { ModalProps as ModalData } from "../components/(timecard)/Modal";

type UseWeekNavigationProps = {
  week: DayOfWeek[];
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  editing: { [iso: string]: number | null };
  setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
  isWeekClean: () => boolean;
  cancelEdit: (iso: string) => void;
  setExpanded: React.Dispatch<
    React.SetStateAction<{ [index: number]: boolean }>
  >;
};

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
  const changeWeek = (days: number) => {
    const isEditingNow = Object.values(editing).some((index) => index !== null);
    if (isEditingNow) {
      setModal({
        title: "Advertencia",
        message: "No puedes cambiar de semana mientras estás editando.",
        onConfirm: () => setModal(null),
      });
      return;
    }

    if (!isWeekClean()) {
      setModal({
        title: "Advertencia",
        message: "Antes de cambiar de semana, debes guardar los cambios.",
        onConfirm: () => setModal(null),
      });
      return;
    }

    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + days);
    setStartDate(newDate);
    setExpanded({});
  };

  const toggleExpand = (index: number) => {
    const iso = week[index]?.iso;
    const isEditingThisDay =
      editing[iso] !== null && editing[iso] !== undefined;
    if (isEditingThisDay) {
      cancelEdit(iso);
    }

    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return { changeWeek, toggleExpand };
}
