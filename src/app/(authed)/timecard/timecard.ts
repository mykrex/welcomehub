// timecard.ts

export const saveWeekData = (data: any) => {
    localStorage.setItem('savedCourses', JSON.stringify(data));
  };
  
  export const loadWeekData = () => {
    const saved = localStorage.getItem('savedCourses');
    return saved ? JSON.parse(saved) : {};
  };
  
  export const saveSubmittedWeeks = (weeks: Set<string>) => {
    localStorage.setItem('submittedWeeks', JSON.stringify(Array.from(weeks)));
  };
  
  export const loadSubmittedWeeks = () => {
    const submitted = localStorage.getItem('submittedWeeks');
    return submitted ? new Set(JSON.parse(submitted)) : new Set<string>();
  };
  
  export const saveApprovedWeeks = (weeks: { [key: string]: string | null }) => {
    localStorage.setItem('approvedWeeks', JSON.stringify(weeks));
  };
  
  export const loadApprovedWeeks = () => {
    const approved = localStorage.getItem('approvedWeeks');
    return approved ? JSON.parse(approved) : {};
  };
  
  export const saveDeliveryDates = (dates: { [key: string]: string }) => {
    localStorage.setItem('deliveryDates', JSON.stringify(dates));
  };
  
  export const loadDeliveryDates = () => {
    const delivery = localStorage.getItem('deliveryDates');
    return delivery ? JSON.parse(delivery) : {};
  };
  