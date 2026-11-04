import { Link } from "react-router-dom";
import { Card, ErrorState, PageHeader, SkeletonTable } from "../components/ui";
import { ProjectsTable } from "../components/ProjectBits";
import { Icon } from "../components/Icon";
import { useMockQuery } from "../lib/demo";
import { applicantName, projectsOfApplicant } from "../lib/data";

export default function ApplicantProjects() {
  const q = useMockQuery(() => projectsOfApplicant(applicantName), []);

  return (
    <div>
      <PageHeader
        title="پروژه‌های من"
        subtitle="فهرست کامل پروژه‌ها، مرحله و وضعیت هر یک"
        actions={
          <Link to="/applicant/new" className="btn btn-accent">
            <Icon name="plus" size={16} />
            درخواست جدید
          </Link>
        }
      />
      {q.status === "loading" ? (
        <Card><SkeletonTable rows={5} /></Card>
      ) : q.status === "error" ? (
        <Card><ErrorState onRetry={q.reload} /></Card>
      ) : (
        <ProjectsTable projects={q.data ?? []} />
      )}
    </div>
  );
}
