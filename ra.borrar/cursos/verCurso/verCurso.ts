export interface LearningPoint {
  text: string;
}

export interface Subsection {
  id: number;
  text: string;
  status: "completed" | "incomplete";
}

export interface Module {
  id: number;
  title: string;
  description: string;
  totalSubsections: number;
  completedSubsections: number;
  subsections: Subsection[];
}

export interface SeeCourse {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  description: string;
  image?: string;
  learningPoints: LearningPoint[];
  modules: Module[];
}
