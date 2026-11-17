import { projects, toCard, findProject } from "@/content/projects";
import ProjectBoard from "@/components/projects/ProjectBoard";
import ProjectWindow from "@/components/projects/ProjectWindow";

// Projects: every project as a card pinned up on a board.
// If the address has ?open=some-slug, that project's pop-up is shown on top.
export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const { open } = await searchParams;
  const openProject = findProject(open);

  return (
    <main>
      <ProjectBoard cards={projects.map(toCard)} />

      {openProject && (
        <ProjectWindow
          // A locked project only sends its card info, never its details.
          project={openProject.locked ? toCard(openProject) : openProject}
          locked={openProject.locked ?? false}
        />
      )}
    </main>
  );
}
