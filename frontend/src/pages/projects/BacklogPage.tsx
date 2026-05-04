import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";

import { sprintApi } from "@/api/sprintApi";
import { issueApi } from "@/api/issueApi";

import SprintColumn from "./SprintColumn";
import BacklogColumn from "./BacklogColumn";
import IssueItem from "./IssueItem";

import CreateIssueModal from "./CreateIssueModal";
import CreateSprintModal from "./CreateSprintModal";
import IssueDetailModal from "./IssueDetailModal";


import type { Sprint } from "@/types";

export default function BacklogPage() {
    const { id } = useParams();
    const projectId = Number(id);

    const queryClient = useQueryClient();


    const [modalType, setModalType] = useState<"issue" | "sprint" | null>(null);
    const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
    const [activeIssue, setActiveIssue] = useState<any>(null);


    const { data: sprintData, isLoading: sprintLoading } = useQuery({
        queryKey: ["sprint", projectId],
        queryFn: () => sprintApi.getProjectSprints(projectId),
    });

    const { data: issueData, isLoading: issueLoading } = useQuery({
        queryKey: ["issues", projectId],
        queryFn: () => issueApi.getProjectIssues(projectId),
    });

    const sprints = sprintData?.sprints ?? [];
    const issues = issueData?.issues ?? [];


    const backlogIssues = issues.filter((i: any) => i.sprint_id === null);


    const updateIssueMutation = useMutation({
        mutationFn: ({ issueId, sprint_id }: any) =>
            issueApi.updateIssues(issueId, { sprintId: sprint_id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
        },
    });


    const startSprintMutation = useMutation({
        mutationFn: (sprintId: number) => sprintApi.startSprint(sprintId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sprint", projectId] });
        },
    });


    const completeSprintMutation = useMutation({
        mutationFn: (sprintId: number) => sprintApi.completeSprint(sprintId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sprint", projectId], refetchType: 'all'});
            queryClient.invalidateQueries({ queryKey: ["issues", projectId], refetchType: 'all' });
        },
    });

    const handleDragStart = (event: any) => {
        const issue = issues.find((i: any) => i.issue_id === event.active.id);
        setActiveIssue(issue);
    };


    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        let sprint_id: number | null = null;

        // CHỈ ACCEPT sprint drop zone
        if (typeof overId === "string" && overId.startsWith("sprint-")) {
            sprint_id = Number(overId.replace("sprint-", ""));
        } else if (overId === "backlog") {
            sprint_id = null;
        } else {
            return; 
        }

        updateIssueMutation.mutate({
            issueId: activeId,
            sprint_id,
        });
    };



    if (sprintLoading || issueLoading) return <div>Loading...</div>;


    return (
        <DndContext onDragStart={handleDragStart}
            onDragEnd={(event) => {
                setActiveIssue(null);
                handleDragEnd(event);
            }}>
            <div className="p-6 space-y-4">


                {sprints.map((sprint: Sprint) => {
                    const sprintIssues = issues.filter(
                        (i: any) => i.sprint_id === sprint.sprint_id
                    );

                    return (
                        <SprintColumn
                            key={sprint.sprint_id}
                            sprint={sprint}
                            issues={sprintIssues}
                            onStart={() => startSprintMutation.mutate(sprint.sprint_id)}
                            onComplete={() =>
                                completeSprintMutation.mutate(sprint.sprint_id)
                            }
                        />
                    );
                })}


                <BacklogColumn
                    issues={backlogIssues}
                    onCreateIssue={() => setModalType("issue")}
                    onCreateSprint={() => setModalType("sprint")}
                    onSelectIssue={(id: number) => setSelectedIssueId(id)}
                />


                <CreateIssueModal
                    open={modalType === "issue"}
                    onClose={() => setModalType(null)}
                    projectId={projectId}
                />

                <CreateSprintModal
                    open={modalType === "sprint"}
                    onClose={() => setModalType(null)}
                    projectId={projectId}
                />

                {selectedIssueId && (
                    <IssueDetailModal
                        open={true}
                        onClose={() => setSelectedIssueId(null)}
                        issueId={selectedIssueId}
                    />
                )}
            </div>
            <DragOverlay>
                {activeIssue && <IssueItem issue={activeIssue} />}
            </DragOverlay>
        </DndContext>
    );
}