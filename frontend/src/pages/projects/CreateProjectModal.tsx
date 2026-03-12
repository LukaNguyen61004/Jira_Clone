import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { projectApi } from "@/api/projectApi"

interface Props{
    open:boolean;
    onClose:() =>void;
}
export default function CreateProjectModal ({open, onClose}: Props){
    const [name, setName] = useState('');
    const [key, setKey]= useState('');
    const [description, setDescription]= useState('');
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: () => projectApi.createProject({ name, key, description }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] }); // refresh danh sách
            onClose(); // đóng modal
        }
    });

   return(
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
          <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Project key" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project description" />
           <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                    {mutation.isPending ? 'Creating...' : 'Create Project'}
                </Button>
        </DialogContent>
    </Dialog>
    
    
   )
}
