import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from 'react';
import { useParams } from "react-router-dom";
import { issueApi } from "@/api/issueApi";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import IssueDetailModal from "./IssueDetailModal";

const COLUMNS = [
  { id: "todo", label: "TODO" },
  { id: "in_progress", label: "IN PROGRESS" },
  { id: "in_review", label: "IN REVIEW" },
  { id: "done", label: "DONE" }
];

export default function BoardPage() {
  const { id } = useParams();
  const projectId = Number(id); // lay id tu URL 

  const queryClient = useQueryClient(); // dung de refesh sau khi dropping
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["issues", projectId],
    queryFn: () => issueApi.getProjectIssues(projectId)
  }); // dung de cache du lieu tu API backend, dung hook useQuery

  const issues = data?.issues ?? [];

  const updateIssueMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      issueApi.updateIssues(id, { status }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issues", projectId]
      });
    }
  }); // dung useMutation cho cac PUT/ POST/ DELETE

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination } = result;

    if (!destination) return;

    updateIssueMutation.mutate({
      id: Number(draggableId),
      status: destination.droppableId
    })


  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4 overflow-x-auto">
        {COLUMNS.map((column) => {
          const columnIssues = issues.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (issue: any) => issue.issue_status === column.id
          );

          return (
            <div key={column.id} className="w-64 shrink-0">

              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-sm text-gray-600">
                  {column.label}
                </h3>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {columnIssues.length}
                </span>
              </div>

              {/* Droppable column */}
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 min-h-25"
                  >
                    {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                    {columnIssues.map((issue: any, index: number) => (
                      <Draggable
                        key={issue.issue_id}
                        draggableId={issue.issue_id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setSelectedIssueId(issue.issue_id)}
                            className="bg-white border rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md"
                          >
                            <p className="text-sm font-medium mb-1">
                              {issue.issue_name}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                {issue.issue_key}
                              </span>

                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${issue.issue_priority === "high"
                                  ? "bg-red-100 text-red-600"
                                  : issue.issue_priority === "medium"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-green-100 text-green-600"
                                  }`}
                              >
                                {issue.issue_priority}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
       {selectedIssueId && (
        <IssueDetailModal
          open={!!selectedIssueId}
          onClose={() => setSelectedIssueId(null)}
          issueId={selectedIssueId}
          
        />
      )}
    </DragDropContext>
    
  );
}