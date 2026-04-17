import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "../../components/ui/dialog"
import {useState} from "react"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sprintApi } from "@/api/sprintApi"


interface Props {
    open: boolean;
    onClose:()=>void;
    projectId: number,
}

export default function CreateSprintModal({open, onClose, projectId}: Props){
    const [name, setName]= useState('');
    const [goal, setGoal]= useState('');
    const [startDate, setStartDate]= useState('');
    const [endDate, setEndDate]= useState('');

    const queryClient = useQueryClient();
    const mutation= useMutation({
        mutationFn: ()=> sprintApi.createSprint(projectId, {name}),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:['sprint']});
            onClose();
        }
    })

     return(
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Create <Sprint</Sprintchatgpt></DialogTitle>
            <DialogDescription>Fill in the details to create a new project</DialogDescription>
        </DialogHeader>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sprint name" />
          <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Sprint goal" />
          <input value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Sprint start date" />
          <input value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Sprint end date" />
           <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                    {mutation.isPending ? 'Creating...' : 'Create Project'}
                </Button>
        </DialogContent>
    </Dialog>
   )
}