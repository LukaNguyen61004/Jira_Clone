import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { sprintApi } from "@/api/sprintApi";
import { issueApi } from "@/api/issueApi";
import { useParams } from "react-router-dom";
import CreateIssueModal from "./CreateIssueModal";
import IssueDetailModal from "./IssueDetailModal";

export default function BacklogPage() {
    const { id } = useParams();
    const projectId = Number(id);

    const queryClient = useQueryClient();
    const [openModal, setOpenModal] = useState(false);

    const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
    const { data: dataSprint, isLoading: isLoadingSprint } = useQuery(
        {
            queryKey: ["sprint", projectId],
            queryFn: () => sprintApi.getProjectSprints(projectId)
        }
    )
    const { data: dataIssue, isLoading: isLoadingIssue } = useQuery(
        {
            queryKey: ["issues", projectId],
            queryFn: () => issueApi.getProjectIssues(projectId)

        }
    )

    const startSprintMutation = useMutation({
        mutationFn: (sprintId: number) => sprintApi.startSprint(sprintId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sprint", projectId] });
        }
    })

    const completeSprintMutation = useMutation({
        mutationFn: (sprintId: number) => sprintApi.completeSprint(sprintId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sprint", projectId] });
            queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
        }
    })

    const sprints = dataSprint?.sprint ?? [];
    const issues = dataIssue?.issues ?? [];

    if (isLoadingSprint || isLoadingIssue) return <div>Loading...</div>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const backlogIssues = issues.filter((issue: any) => issue.sprint_id === null);
    return (
        <div className="p-6 space-y-4">

            {/* Sprint sections */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
            {sprints.map((sprint: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const sprintIssues = issues.filter((issue: any) => issue.sprint_id === sprint.sprint_id);

                return (
                    <div key={sprint.sprint_id} className="border rounded-lg overflow-hidden">
                        {/* Sprint header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                            <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-gray-800">{sprint.sprint_name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sprint.sprint_status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {sprint.sprint_status}
                                </span>
                                <span className="text-xs text-gray-400">{sprintIssues.length} issues</span>
                            </div>

                            {/* Action button */}
                            {sprint.sprint_status === 'planned' && (
                                <button
                                    onClick={() => startSprintMutation.mutate(sprint.sprint_id)}
                                    disabled={startSprintMutation.isPending}
                                    className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Start Sprint
                                </button>
                            )}
                            {sprint.sprint_status === 'active' && (
                                <button
                                    onClick={() => completeSprintMutation.mutate(sprint.sprint_id)}
                                    disabled={completeSprintMutation.isPending}
                                    className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 disabled:opacity-50"
                                >
                                    Complete Sprint
                                </button>
                            )}
                        </div>

                        {/* Sprint issues */}
                        <div className="divide-y">
                            {sprintIssues.length === 0 ? (
                                <p className="text-sm text-gray-400 px-4 py-3">No issues in this sprint</p>
                            ) : (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                sprintIssues.map((issue: any) => (
                                    <div key={issue.issue_id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400 w-16">{issue.issue_key}</span>
                                            <span className="text-sm text-gray-800">{issue.issue_name}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${issue.issue_priority === 'high' ? 'bg-red-100 text-red-600' :
                                            issue.issue_priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                            {issue.issue_priority}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Backlog section */}
            <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-800">Backlog</h3>
                        <span className="text-xs text-gray-400">{backlogIssues.length} issues</span>
                    </div>
                    <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700" onClick={() => setOpenModal(true)}>
                        + Create Issue
                    </button>
                </div>

                <div className="divide-y">
                    {backlogIssues.length === 0 ? (
                        <p className="text-sm text-gray-400 px-4 py-3">No issues in backlog</p>
                    ) : (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        backlogIssues.map((issue: any) => (
                            <div key={issue.issue_id}
                                onClick={() => setSelectedIssueId(issue.issue_id)}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400 w-16">{issue.issue_key}</span>
                                    <span className="text-sm text-gray-800">{issue.issue_name}</span>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${issue.issue_priority === 'high' ? 'bg-red-100 text-red-600' :
                                    issue.issue_priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-green-100 text-green-600'
                                    }`}>
                                    {issue.issue_priority}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <CreateIssueModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                projectId={projectId}
            />
            {selectedIssueId && (
                <IssueDetailModal
                    open={!!selectedIssueId}
                    onClose={() => setSelectedIssueId(null)}
                    issueId={selectedIssueId}
                    
                />
            )}
        </div>

    );
}