import { useDroppable } from "@dnd-kit/core";
import type { Issue } from "../../types/index"
import IssueItem from "./IssueItem";

export default function SprintColumn({ sprint, issues, onStart, onComplete }: any) {
  const { setNodeRef } = useDroppable({
    id: `sprint-${sprint.sprint_id}`,
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">{sprint.sprint_name}</h3>
          <span className="text-xs text-gray-400">
            {issues.length} issues
          </span>
        </div>

        {sprint.sprint_status === 'planned' && (
          <button
            onClick={onStart}
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
          >
            Start Sprint
          </button>
        )}
        {sprint.sprint_status === 'active' && (
          <button
            onClick={onComplete}
            className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700"
          >
            Complete Sprint
          </button>
        )}
      </div>



      <div ref={setNodeRef} className="divide-y min-h-[50px]">
        {issues.length === 0 ? (
          <p className="text-sm text-gray-400 px-4 py-3">
            No issues
          </p>
        ) : (
          issues.map((issue: Issue) => (
            <IssueItem key={issue.issue_id} issue={issue} />
          ))
        )}
      </div>
    </div>
  );
}