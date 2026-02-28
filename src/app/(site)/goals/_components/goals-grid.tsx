import { ProjectCard } from "@/components/ProjectCard";

const allGoals = [
  { id: 1, name: "Vacaciones Europa", target: 80000, current: 32000, deadline: "Dic 2025" },
  { id: 2, name: "Fondo de emergencia", target: 150000, current: 95000, deadline: "Mar 2025" },
  { id: 3, name: "MacBook Pro", target: 45000, current: 18000, deadline: "Jun 2025" },
  { id: 4, name: "Curso de inglés", target: 25000, current: 25000, deadline: "Completado" },
  { id: 5, name: "Boda", target: 200000, current: 45000, deadline: "Dic 2026" },
];

export const GoalsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allGoals.map((goal) => (
        <ProjectCard key={goal.id} name={goal.name} target={goal.target} current={goal.current} deadline={goal.deadline} />
      ))}
    </div>
  );
};
