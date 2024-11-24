export interface Task {
  id: number;
  name: string;
  type: string;
  timeAll: number;
  status: string;
  dueDate: string;
  priority: number;
  ownerId: number;
  classId: number;
}
