import { useState } from "react";
import { issueApi } from "@/api/issueApi";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';


interface Props {
    open: boolean;
    onClose: () => void;
    issueId: number;
   
}

export default function IssueDetailModal({ open, onClose, issueId,  }: Props) {
    const [comment, setComment] = useState('');
    const queryClient = useQueryClient();

    const { data: dataIssues, isLoading: isLoadingIssue } = useQuery({
        queryKey: ["issue", issueId],
        queryFn: () => issueApi.getIssueById(issueId)
    })

    const { data: dataComments, isLoading: isLoadingComment } = useQuery({
        queryKey: ["comments", issueId],
        queryFn: () => issueApi.getIssueComments(issueId)
    })

    const addComment = useMutation({
        mutationFn: (issueId: number) => issueApi.addComment(issueId, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
            setComment('');

        }
    })

    const issue = dataIssues?.issue ?? [];
    const comments = dataComments?.comments ?? [];

    if (isLoadingIssue || isLoadingComment) return <div>Loading...</div>;


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{issue?.issue_name}</DialogTitle>
                </DialogHeader>

                {/* Issue info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Type: </span>
                        <span>{issue?.issue_type}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Priority: </span>
                        <span>{issue?.issue_priority}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Status: </span>
                        <span>{issue?.issue_status}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Assignee: </span>
                        <span>{issue?.assignee_name ?? 'Unassigned'}</span>
                    </div>
                </div>

                {/* Description */}
                {issue?.issue_description && (
                    <div>
                        <p className="text-sm font-medium mb-1">Description</p>
                        <p className="text-sm text-gray-600">{issue.issue_description}</p>
                    </div>
                )}

                {/* Comments */}
                <div>
                    <p className="text-sm font-medium mb-2">Comments ({comments.length})</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                        {comments.map((c: any) => (
                            <div key={c.comment_id} className="text-sm border rounded p-2">
                                <span className="font-medium">{c.user_name}: </span>
                                <span className="text-gray-600">{c.comment_content}</span>
                            </div>
                        ))}
                    </div>

                    {/* Add comment */}
                    <div className="flex gap-2 mt-3">
                        <input
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 border rounded px-3 py-1.5 text-sm"
                        />
                        <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
                            onClick={() => addComment.mutate(issue.issue_id)}>
                            Send
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );


} 
