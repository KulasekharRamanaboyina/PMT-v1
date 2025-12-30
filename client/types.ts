export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'ADMIN' | 'MEMBER';
  email: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  dueDate: string; // ISO Date string
  tags: string[];
  sourceLink?: string;

}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface BoardColumn {
  id: TaskStatus;
  title: string;
}

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Rivera', email: 'alex@nexus.app', avatar: 'https://picsum.photos/100/100?random=1', role: 'ADMIN' },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@nexus.app', avatar: 'https://picsum.photos/100/100?random=2', role: 'MEMBER' },
  { id: 'u3', name: 'Mike Johnson', email: 'mike@nexus.app', avatar: 'https://picsum.photos/100/100?random=3', role: 'MEMBER' },
  { id: 'u4', name: 'Emily Davis', email: 'emily@nexus.app', avatar: 'https://picsum.photos/100/100?random=4', role: 'MEMBER' },
];

export const INITIAL_WORKSPACES: Workspace[] = [
    { 
      id: 'ws1', 
      name: 'Product Launch', 
      description: 'Main workspace for the Q4 product release and marketing coordination.',
      ownerId: 'u1', 
      memberIds: ['u1', 'u2', 'u3', 'u4'],
      createdAt: '2023-10-15T10:00:00.000Z'
    },
    { 
      id: 'ws2', 
      name: 'Internal Ops', 
      description: 'Workspace for day-to-day administrative tasks and financial reporting.',
      ownerId: 'u1', 
      memberIds: ['u1', 'u3'],
      createdAt: '2023-11-02T14:30:00.000Z'
    },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    workspaceId: 'ws1',
    title: 'Design System Audit',
    description: 'Review current UI components and identify inconsistencies.',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    assigneeId: 'u1',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    tags: ['Design', 'UI/UX']
  },
  {
    id: 't2',
    workspaceId: 'ws1',
    title: 'API Authentication Flow',
    description: 'Implement JWT refresh token rotation.',
    status: TaskStatus.TODO,
    priority: Priority.CRITICAL,
    assigneeId: 'u2',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    tags: ['Backend', 'Security']
  },
  {
    id: 't3',
    workspaceId: 'ws1',
    title: 'Q3 Marketing Plan',
    description: 'Draft initial outreach strategy for Q3 product launch.',
    status: TaskStatus.DONE,
    priority: Priority.MEDIUM,
    assigneeId: 'u3',
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    tags: ['Marketing']
  },
  {
    id: 't4',
    workspaceId: 'ws1',
    title: 'Fix Mobile Navigation',
    description: 'Hamburger menu not closing on selection.',
    status: TaskStatus.TODO,
    priority: Priority.LOW,
    assigneeId: 'u4',
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    tags: ['Bug', 'Frontend']
  },
  {
    id: 't5',
    workspaceId: 'ws2',
    title: 'Payroll Integration',
    description: 'Connect to Stripe for automated payroll.',
    status: TaskStatus.TODO,
    priority: Priority.HIGH,
    assigneeId: 'u1',
    dueDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    tags: ['Finance']
  },
];