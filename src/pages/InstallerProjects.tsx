import { Card, ErrorState, PageHeader, SkeletonTable } from "../components/ui";
import { ProjectsTable } from "../components/ProjectBits";
import { useMockQuery } from "../lib/demo";
import { useRole } from "../lib/role";
import { projectsOfInstaller } from "../lib/data";

export default function InstallerProjects() {
  const { user } = useRole();
  const q = useMockQuery(() => projectsOfInstaller(user), [user]);

  return (
    <div>
      <PageHeader title="پروژه‌های ارجاعی" subtitle="همه پروژه‌های تخصیص‌یافته به شرکت شما" />
      {q.status === "loading" ? <Card><SkeletonTable rows={5} /></Card> : q.status === "error" ? <Card><ErrorState onRetry={q.reload} /></Card> : <ProjectsTable projects={q.data ?? []} />}
    </div>
  );
}
