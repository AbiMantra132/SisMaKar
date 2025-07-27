"use client";
import { createTask, updateTask, deleteTask } from "../../../utils/fetchTask";
import { FormEvent, useEffect, useState } from "react";
import { NavigationBar } from "../../../components/Navbar";
import { fetchEmployeesByDepartment } from "../../../utils/fetchEmployee";
import {
  createSchedule,
  getSchedulesByDepartment,
  deleteSchedule,
} from "../../../utils/fetchSchedule";
import { fetchDepartmentHeadId } from "../../../utils/fetchDepartment";

interface User {
  id: number;
  fullName: string;
  age: number;
  departmentName: string;
  position: string;
  email: string;
  password: string;
  role: "EMPLOYEE" | "HR" | "ADMIN" | "HEAD";
  statusEmployee: string;
  joiningDate: string;
  createdAt: string;
  updatedAt: string;
  statusAccount: string;
  firstName?: string;
  lastName?: string;
}

interface Schedule {
  id: number;
  userId: number;
  managerId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  scheduleTasks?: { task: Task }[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assignedTo: number;
  departmentId: number;
  assignedDate: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskInput {
  title: string;
  description: string;
}

export default function HeadDepartmentPage({
  params,
}: {
  params: { departmentId: string };
}) {
  const [employees, setEmployees] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentDateRange, setCurrentDateRange] = useState({
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 9)),
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: new Date(),
    startTime: "",
    endTime: "",
  });
  // For new tasks in create modal
  const [taskInputs, setTaskInputs] = useState<TaskInput[]>([]);
  const [newTaskInput, setNewTaskInput] = useState<TaskInput>({
    title: "",
    description: "",
  });

  // For edit modal
  const [editForm, setEditForm] = useState<{
    startTime: string;
    endTime: string;
    scheduleTasks: Task[];
    title: string;
    description: string;
    taskStatus?: string;
  }>({
    startTime: "",
    endTime: "",
    scheduleTasks: [],
    title: "",
    description: "",
    taskStatus: "pending",
  });

  // Fetch employees from BE
  useEffect(() => {
    const loadEmployees = async () => {
      const employee = await fetchEmployeesByDepartment(params.departmentId);
      const data = employee.data || [];

      const mapped = Array.isArray(data)
        ? data.map((emp: User) => {
            const [firstName, ...rest] = emp.fullName.split(" ");
            return {
              ...emp,
              firstName,
              lastName: rest.join(" "),
            };
          })
        : [];
      setEmployees(mapped);
    };
    loadEmployees();
  }, [params.departmentId]);

  // Fetch schedules from BE (rewritten to filter by department and date range)
  useEffect(() => {
    const fetchSchedulesForDepartment = async () => {
      const employeeIds = employees.map((emp) => emp.id);
      if (employeeIds.length === 0) {
        setSchedules([]);
        return;
      }
      const allSchedules = await getSchedulesByDepartment(params.departmentId);
      setSchedules(allSchedules);
    };
    fetchSchedulesForDepartment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, currentDateRange]);

  const getDatesArray = () => {
    const dates = [];
    let currentDate = new Date(currentDateRange.start);
    while (currentDate <= currentDateRange.end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}`;
  };

  const navigateDates = (direction: "prev" | "next") => {
    const days = direction === "next" ? 10 : -10;
    setCurrentDateRange((prev) => {
      const newStart = new Date(prev.start);
      newStart.setDate(newStart.getDate() + days);
      const newEnd = new Date(prev.end);
      newEnd.setDate(newEnd.getDate() + days);
      return {
        start: newStart,
        end: newEnd,
      };
    });
  };

  // Handle create schedule + create task(s)
  const handleCreateSchedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedEmployee || taskInputs.length === 0) return;
    const { headId } = await fetchDepartmentHeadId(
      selectedEmployee.departmentName
    );
    const managerId = headId ? Number(headId) : 0;
    const date = scheduleForm.date;
    const startTime = new Date(date);
    const [startHour, startMinute] = scheduleForm.startTime.split(":");
    startTime.setHours(Number(startHour), Number(startMinute), 0, 0);
    const endTime = new Date(date);
    const [endHour, endMinute] = scheduleForm.endTime.split(":");
    endTime.setHours(Number(endHour), Number(endMinute), 0, 0);

    // 1. Create all tasks
    let createdTasks: Task[] = [];
    try {
      for (const task of taskInputs) {
        const created = await createTask({
          title: task.title,
          description: task.description,
          assignedTo: selectedEmployee.id,
          status: "pending",
          departmentName: selectedEmployee.departmentName,
        });
        createdTasks.push(created);
      }
    } catch (err) {
      alert("Failed to create task(s)");
      return;
    }

    // 2. Create Schedule with all taskIds
    try {
      console.log({
        userId: selectedEmployee.id,
        managerId,
        date: date.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        taskIds: createdTasks.map((t) => t.id),
      });
      await createSchedule({
        userId: selectedEmployee.id,
        managerId,
        date: date.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        taskIds: createdTasks.map((t) => t.id),
      });
      setShowScheduleModal(false);
      setScheduleForm({
        date: new Date(),
        startTime: "",
        endTime: "",
      });
      setSelectedEmployee(null);
      setTaskInputs([]);
      setNewTaskInput({ title: "", description: "" });
      // Refetch schedules
      const allSchedules = await getSchedulesByDepartment(params.departmentId);
      setSchedules(allSchedules);
    } catch (err) {
      alert("Failed to create schedule");
    }
  };

  // Handle update schedule & task
  const handleUpdateSchedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSchedule || !selectedTask) return;
    // Update Task
    try {
      await updateTask({
        id: selectedTask.id,
        title: editForm.title,
        description: editForm.description,
        status: editForm.taskStatus as any,
      });
    } catch (err) {
      alert("Failed to update task");
      return;
    }
    // Update Schedule
    try {
      const date = new Date(selectedSchedule.date);
      const startTime = new Date(date);
      const [startHour, startMinute] = editForm.startTime.split(":");
      startTime.setHours(Number(startHour), Number(startMinute), 0, 0);
      const endTime = new Date(date);
      const [endHour, endMinute] = editForm.endTime.split(":");
      endTime.setHours(Number(endHour), Number(endMinute), 0, 0);

      await fetch(`/schedule/${selectedSchedule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          taskIds: [selectedTask.id],
        }),
      });
      setShowEditModal(false);
      setSelectedSchedule(null);
      setSelectedTask(null);
      // Refetch schedules
      const allSchedules = await getSchedulesByDepartment(params.departmentId);
      setSchedules(allSchedules);
    } catch (err) {
      alert("Failed to update schedule");
    }
  };

  // Handle delete schedule & task
  const handleDeleteSchedule = async () => {
    if (!selectedSchedule) return;
    try {
      await deleteSchedule(selectedSchedule.id);
      if (selectedTask) {
        await deleteTask({
          id: selectedTask.id,
          userId: selectedSchedule.userId,
        });
      }
      setShowEditModal(false);
      setSelectedSchedule(null);
      setSelectedTask(null);
      // Refetch schedules
      const allSchedules = await getSchedulesByDepartment(params.departmentId);
      setSchedules(allSchedules);
    } catch (err) {
      alert("Failed to delete schedule/task");
    }
  };

  // When clicking a cell
  const handleCellClick = (employee: User, date: Date) => {
    const schedule = schedules.find(
      (s) =>
        s.userId === employee.id &&
        new Date(s.date).toDateString() === date.toDateString()
    );
    if (schedule) {
      // Find the first task (if any)
      const tasks = schedule.scheduleTasks?.map((st) => st.task) || [];
      const firstTask = tasks[0] || {};
      setSelectedSchedule(schedule);
      setSelectedTask(firstTask as Task);
      setEditForm({
        startTime: schedule.startTime
          ? new Date(schedule.startTime).toTimeString().slice(0, 5)
          : "",
        endTime: schedule.endTime
          ? new Date(schedule.endTime).toTimeString().slice(0, 5)
          : "",
        title: firstTask.title || "",
        description: firstTask.description || "",
        taskStatus: firstTask.status || "pending",
        scheduleTasks: tasks,
      });
      setShowEditModal(true);
    } else {
      setSelectedEmployee(employee);
      setSelectedDate(date);
      setScheduleForm({
        date,
        startTime: "",
        endTime: "",
      });
      setTaskInputs([]);
      setNewTaskInput({ title: "", description: "" });
      setShowScheduleModal(true);
    }
  };

  // Add a new task input to the list
  const handleAddTaskInput = () => {
    if (!newTaskInput.title.trim()) return;
    setTaskInputs([...taskInputs, newTaskInput]);
    setNewTaskInput({ title: "", description: "" });
  };

  // Remove a task input from the list
  const handleRemoveTaskInput = (idx: number) => {
    setTaskInputs(taskInputs.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="font-poppins scale-90">
        <NavigationBar accountName="Head Department" />
        <div className="flex items-center justify-between mt-10">
          <div className="flex flex-col items-start">
            <h3 className="text-primary-color">
              Sense Sunset Seminyak Employee Management System
            </h3>
            <h1 className="font-bold text-4xl text-contrast-color">
              Welcome, Heads
            </h1>
          </div>
        </div>
        <div className="px-4 py-6 md:px-8 mt-10">
          {/* Month Filter */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <label htmlFor="monthFilter" className="text-contrast-color">
                Filter by Month
              </label>
              <input
                id="monthFilter"
                type="month"
                defaultValue={new Date().toISOString().slice(0, 7)}
                className="px-4 py-2 border-contrast-color rounded-full hover:border-primary-color transition-all duration-300 ease-in-out border-[1px]"
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-");
                  const start = new Date(Number(year), Number(month) - 1, 1);
                  const end = new Date(start);
                  end.setDate(start.getDate() + 9);
                  setCurrentDateRange({ start, end });
                }}
              />
            </div>
            <div className="flex justify-between">
              <button className="bg-green-600 text-white px-6 py-2 rounded-full shadow-md hover:opacity-80 transition-all duration-300 ease-in-out mr-2">
                Download XLSX
              </button>
              <button
                onClick={() => {
                  window.location.href = `/heads/${params.departmentId}/employees`;
                }}
                className="bg-primary-color text-white px-6 py-2 rounded-full shadow-md hover:opacity-80 transition-all duration-300 ease-in-out"
              >
                List Employees
              </button>
            </div>
          </div>

          <div className="mr-5">
            <div
              className="grid gap-2 justify-center scale-105"
              style={{
                gridTemplateColumns: `200px repeat(${
                  getDatesArray().length
                }, 150px)`,
              }}
            >
              {/* Header Row */}
              <div className="sticky left-0 bg-gray-50 border p-3 font-semibold text-contrast-color">
                Employee
              </div>
              {getDatesArray().map((date) => (
                <div
                  key={date.toISOString()}
                  className="bg-gray-50 border p-3 font-semibold text-contrast-color"
                >
                  {formatDate(date)}
                </div>
              ))}

              {/* Employee Rows */}
              {employees.map((employee) => (
                <>
                  <div
                    key={`emp-${employee.id}`}
                    className="sticky left-0 bg-white border p-3 font-medium text-contrast-color"
                  >
                    {employee.firstName || employee.fullName.split(" ")[0]}{" "}
                    {employee.lastName ||
                      employee.fullName.split(" ").slice(1).join(" ")}
                  </div>
                  {getDatesArray().map((date) => {
                    const schedule = schedules.find(
                      (s) =>
                        s.userId === employee.id &&
                        new Date(s.date).toDateString() === date.toDateString()
                    );
                    return (
                      <div
                        key={`${employee.id}-${date.toISOString()}`}
                        className={`border-[1px] p-3 cursor-pointer min-h-[100px]
          ${
            schedule
              ? "bg-primary-color/10 text-gray-400 hover:bg-primary-color/30 hover:border-primary-color"
              : "bg-gray-50 text-gray-400 hover:bg-gray-200"
          }
          transition-colors duration-200`}
                        onClick={() => handleCellClick(employee, date)}
                      >
                        {schedule ? (
                          <div className="text-sm">
                            <div className="font-medium text-primary-color">
                              {new Date(schedule.startTime).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}{" "}
                              -{" "}
                              {new Date(schedule.endTime).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">
                            No schedule
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>

          {/* Pagination below calendar */}
          <div className="flex justify-between items-center mt-10 gap-4">
            <button
              onClick={() => navigateDates("prev")}
              className="px-8 py-3 border-[1px] border-contrast-color text-contrast-color rounded-full font-semibold hover:bg-contrast-color hover:text-white transition-all duration-300 ease-in-out"
            >
              ←
            </button>
            <button
              onClick={() => navigateDates("next")}
              className="px-8 py-3 border-[1px] border-contrast-color text-contrast-color rounded-full font-semibold hover:bg-contrast-color hover:text-white transition-all duration-300 ease-in-out"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Modal Create */}
      {showScheduleModal && (
        <>
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl w-[600px] animate-[slideIn_0.3s_ease-out]">
              <h2 className="text-2xl font-bold text-contrast-color mb-6">
                Create New Schedule
              </h2>
              <form onSubmit={handleCreateSchedule}>
                <select
                  className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-xl focus:outline-primary-color"
                  value={selectedEmployee?.id ?? ""}
                  onChange={(e) =>
                    setSelectedEmployee(
                      employees.find(
                        (emp) => emp.id === Number(e.target.value)
                      ) || null
                    )
                  }
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {(emp.firstName || emp.fullName.split(" ")[0]) +
                        " " +
                        (emp.lastName ||
                          emp.fullName.split(" ").slice(1).join(" "))}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-xl focus:outline-primary-color"
                  value={scheduleForm.date.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      date: new Date(e.target.value),
                    })
                  }
                  required
                />

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="time"
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-primary-color"
                    value={scheduleForm.startTime}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        startTime: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="time"
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-primary-color"
                    value={scheduleForm.endTime}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        endTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Task Inputs */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold text-contrast-color">
                    Tasks
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-primary-color"
                      placeholder="Task Title"
                      value={newTaskInput.title}
                      onChange={(e) =>
                        setNewTaskInput({
                          ...newTaskInput,
                          title: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-primary-color"
                      placeholder="Task Description"
                      value={newTaskInput.description}
                      onChange={(e) =>
                        setNewTaskInput({
                          ...newTaskInput,
                          description: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      className="bg-primary-color text-white px-4 py-2 rounded-xl hover:opacity-80"
                      onClick={handleAddTaskInput}
                      title="Add Task"
                    >
                      +
                    </button>
                  </div>
                  <ul>
                    {taskInputs.map((task, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 mb-1 bg-gray-100 rounded px-2 py-1"
                      >
                        <span className="font-semibold">{task.title}</span>
                        <span className="text-gray-500 text-xs">
                          {task.description}
                        </span>
                        <button
                          type="button"
                          className="ml-auto text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveTaskInput(idx)}
                          title="Remove"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                  {taskInputs.length === 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      Add at least one task
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-color text-white rounded-xl hover:opacity-80"
                    disabled={taskInputs.length === 0}
                  >
                    Create Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Modal Edit/Update/Delete */}
      {showEditModal && (
        <>
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl w-[500px] animate-[slideIn_0.3s_ease-out]">
              <h2 className="text-2xl font-bold text-contrast-color mb-6">
                Edit Schedule & Tasks
              </h2>
              <form onSubmit={handleUpdateSchedule}>
                <div className="mb-4">
                  <label className="block mb-1">Start Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-primary-color"
                    value={editForm.startTime}
                    onChange={(e) =>
                      setEditForm({ ...editForm, startTime: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">End Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-primary-color"
                    value={editForm.endTime}
                    onChange={(e) =>
                      setEditForm({ ...editForm, endTime: e.target.value })
                    }
                    required
                  />
                </div>
                {/* Task Titles Only */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold text-contrast-color">
                    Tasks
                  </label>
                  {editForm.scheduleTasks &&
                  editForm.scheduleTasks.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {editForm.scheduleTasks.map((task) => (
                        <li
                          key={task.id}
                          className="mb-2 text-contrast-color font-medium"
                        >
                          {task.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-gray-400 mt-1">
                      No tasks available for this schedule.
                    </div>
                  )}
                </div>
                <div className="flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleDeleteSchedule}
                    className="px-6 py-2 bg-red-500 text-white rounded-xl hover:opacity-80"
                  >
                    Delete
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-color text-white rounded-xl hover:opacity-80"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
