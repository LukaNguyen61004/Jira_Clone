import { useDraggable } from "@dnd-kit/core";
import type { Issue } from "@/types";

 type Props = {
  issue: Issue;
  onClick?: () => void;
};

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function IssueItem({ issue, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: issue.issue_id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-grab"
    >
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 w-16">
          {issue.issue_key}
        </span>
        <span className="text-sm text-gray-800">
          {issue.issue_name}
        </span>
      </div>

      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          issue.issue_priority === "high"
            ? "bg-red-100 text-red-600"
            : issue.issue_priority === "medium"
            ? "bg-yellow-100 text-yellow-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {issue.issue_priority}
      </span>
    </div>
  );
}