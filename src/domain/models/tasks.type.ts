export type taskDetails = {
    id: number;
    title: string;
    description: string;
    status: string;
    deadline: Date;
    assigneeId: number | null;
    projectId: number;
}