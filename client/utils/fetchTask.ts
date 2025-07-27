const EMPLOYEE_ROUTES_ORIGIN = "http://localhost:4001/task/";

interface CreateTaskDto {
  title: string;
  description: string;
  assignedTo: number;
  status: "pending" | "in-progress" | "completed";
  departmentName: string;
}

interface UpdateTaskDto {
  id: number;
  title?: string;
  description?: string;
  status?: "pending" | "in-progress" | "completed";
}

interface DeleteTaskDto {
  id: number;
  userId: number;
}

export const createTask = async (data: CreateTaskDto) => {
  try {
    const response = await fetch(`${EMPLOYEE_ROUTES_ORIGIN}create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (data: UpdateTaskDto) => {
  try {
    const response = await fetch(`${EMPLOYEE_ROUTES_ORIGIN}update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (data: DeleteTaskDto) => {
  try {
    const response = await fetch(`${EMPLOYEE_ROUTES_ORIGIN}delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

