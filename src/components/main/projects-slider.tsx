import { Target } from "lucide-react";
import { ProjectCard } from "../ProjectCard";
import { SectionHeader } from "../SectionHeader";

const mockProjects = [
  { id: 1, name: "Vacaciones Europa", target: 80000, current: 32000, deadline: "Dic 2025" },
  { id: 2, name: "Fondo de emergencia", target: 150000, current: 95000, deadline: "Mar 2025" },
];

export const ProjectSlider = () => {
  return (
    <>
      <SectionHeader title="Metas de ahorro" subtitle="Tus proyectos financieros" icon={Target} action={{ label: "Nueva meta", path: "/goals" }} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} name={project.name} target={project.target} current={project.current} deadline={project.deadline} />
        ))}
      </div>
    </>
  );
};
