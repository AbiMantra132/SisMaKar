const SCHEDULE_API_ORIGIN = "http://localhost:4001/schedule/";

interface CreateScheduleDto {
  userId: number;
  managerId: number;
  date: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  taskIds?: number[];
}

interface UpdateScheduleDto {
  date?: Date | string;
  startTime?: Date | string;
  endTime?: Date | string;
  status?: string;
  taskIds?: number[];
}

export const createSchedule = async (data: CreateScheduleDto) => {
  try {
    const response = await fetch(`${SCHEDULE_API_ORIGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(response);

    if (!response.ok) throw new Error("Failed to create schedule");
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getScheduleById = async (id: number) => {
  try {
    const response = await fetch(`${SCHEDULE_API_ORIGIN}${id}`);
    if (!response.ok) throw new Error("Failed to fetch schedule");
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getSchedulesByDepartment = async (departmentName: string) => {
  try {
    const response = await fetch(`${SCHEDULE_API_ORIGIN}department/${departmentName}`);
    if (!response.ok) throw new Error("Failed to fetch schedules by department");
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getSchedulesByUserId = async (userId: number) => {
  try {
    const response = await fetch(`${SCHEDULE_API_ORIGIN}user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch schedules by userId");
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateSchedule = async (id: number, data: UpdateScheduleDto) => {
  try {
    const response = await fetch(`${SCHEDULE_API_ORIGIN}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update schedule");
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteSchedule = async (id: number) => {
  try {
    const response = await fetch(`${SCHEDULE_API_ORIGIN}${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete schedule");
    return await response.json();
  } catch (error) {
    throw error;
  }
};