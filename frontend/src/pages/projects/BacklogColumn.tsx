import { useDroppable } from "@dnd-kit/core";
import type { Issue } from "../../types/index"
import IssueItem from "./IssueItem";

type Props = {
  issues: any[];
  onCreateIssue: () => void;
  onCreateSprint: () => void;
  onSelectIssue?: (id: number) => void;
};

export default function BacklogColumn({ issues, onCreateIssue, onCreateSprint, onSelectIssue }: Props) {
  const { setNodeRef } = useDroppable({
    id: "backlog",
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b">
        <h3 className="font-semibold">Backlog</h3>
        <span className="text-xs text-gray-400">
          {issues.length} issues
        </span>
          <div className="flex gap-2 flex-row-reverse">
        <button
          onClick={onCreateIssue}
          className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md"
        >
          + Create Issue
        </button>

        <button
          onClick={onCreateSprint}
          className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md"
        >
          + Create Sprint
        </button>
      </div>
      </div>

    

      <div ref={setNodeRef} className="divide-y min-h-[50px]">
        {issues.length === 0 ? (
          <p className="text-sm text-gray-400 px-4 py-3">
            No issues
          </p>
        ) : (
          issues.map((issue: Issue) => (
            <IssueItem key={issue.issue_id} issue={issue} onClick={() => onSelectIssue?.(issue.issue_id)}/>
          ))
        )}
      </div>
    </div>
  );
}