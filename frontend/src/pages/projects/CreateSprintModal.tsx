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
        mutationFn: ()=> sprintApi.createSprint(projectId, {name,goal,startDate, endDate}),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:['sprint',projectId]});
            onClose();
        }
    })

     return(
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Create Sprint</DialogTitle>
            <DialogDescription>Fill in the details to create a new sprint</DialogDescription>
        </DialogHeader>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sprint name" />
          <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Sprint goal" />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Sprint start date" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Sprint end date" />
           <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                    {mutation.isPending ? 'Creating...' : 'Create Sprint'}
                </Button>
        </DialogContent>
    </Dialog>
   )
}