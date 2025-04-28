interface Course {
    title: string;
    hours: number;
  }
  
  type CoursesPerDay = { [iso: string]: Course[] };
  type SavedCourses = { [weekKey: string]: CoursesPerDay };
  
  export const saveWeekData = (data: SavedCourses) => {
    localStorage.setItem('savedCourses', JSON.stringify(data));
  };
  
  export const loadWeekData = (): SavedCourses => {
    const saved = localStorage.getItem('savedCourses');
    return saved ? JSON.parse(saved) : {};
  };
  
  export const saveSubmittedWeeks = (weeks: Set<string>) => {
    localStorage.setItem('submittedWeeks', JSON.stringify(Array.from(weeks)));
  };
  
  export const loadSubmittedWeeks = (): Set<string> => {
    const submitted = localStorage.getItem('submittedWeeks');
    return submitted ? new Set(JSON.parse(submitted)) : new Set<string>();
  };
  
  export const saveApprovedWeeks = (weeks: { [key: string]: string | null }) => {
    localStorage.setItem('approvedWeeks', JSON.stringify(weeks));
  };
  
  export const loadApprovedWeeks = (): { [key: string]: string | null } => {
    const approved = localStorage.getItem('approvedWeeks');
    return approved ? JSON.parse(approved) : {};
  };
  
  export const saveDeliveryDates = (dates: { [key: string]: string }) => {
    localStorage.setItem('deliveryDates', JSON.stringify(dates));
  };
  
  export const loadDeliveryDates = (): { [key: string]: string } => {
    const delivery = localStorage.getItem('deliveryDates');
    return delivery ? JSON.parse(delivery) : {};
  };
  