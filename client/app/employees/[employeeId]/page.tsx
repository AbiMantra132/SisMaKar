"use client";
import { useEffect, useState, use } from "react";
import * as React from "react";
import { NavigationBar } from "../../../components/Navbar";
import { useRouter } from "next/navigation";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { fetchCompleteProfile } from "../../../utils/fetchProfile";
import { getSchedulesByUserId } from "../../../utils/fetchSchedule";
import { createScheduleChangeRequest } from "../../../utils/fetchNotification";
import { fetchEmployeesByDepartment } from "../../../utils/fetchEmployee";

export default function EmployeePage({
  params,
}: {
  params: { employeeId: string };
}) {
  const { employeeId } = params;
  const monthDays = {
    1: 31, // January
    2: new Date().getFullYear() % 4 === 0 ? 29 : 28, // February
    3: 31, // March
    4: 30, // April
    5: 31, // May
    6: 30, // June
    7: 31, // July
    8: 31, // August
    9: 30, // September
    10: 31, // October
    11: 30, // November
    12: 31, // December
  };

  const router = useRouter();
  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    age: 0,
    department: "",
    position: "",
    role: "",
  });

  type Task = {
    title: string;
    status: string;
    dueDate: string;
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now()).toISOString().slice(0, 10)
  );

  const [modalInfo, setModalInfo] = useState<{
    date: string;
    shifts: { start: string; end: string }[];
  } | null>(null);

  const [scheduleChangeModal, setScheduleChangeModal] = useState<{
    date: string;
    shifts: { start: string; end: string }[];
  } | null>(null);
  const [scheduleChangeMessage, setScheduleChangeMessage] =
    useState<string>("");
  const [scheduleChangeStart, setScheduleChangeStart] = useState<string>("");
  const [scheduleChangeEnd, setScheduleChangeEnd] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [replacementDate, setReplacementDate] = useState<string>("");

  // State for leave request modal
  const [leaveRequestModalOpen, setLeaveRequestModalOpen] =
    useState<boolean>(false);
  const [leaveRequestDate, setLeaveRequestDate] = useState<string>("");
  const [leaveRequestMessage, setLeaveRequestMessage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await fetchCompleteProfile(Number(employeeId));

        const user = profile.user;

        setProfileData({
          fullName: user.fullName || "",
          phoneNumber: user.phoneNumber || "",
          email: user.email || "",
          password: user.password || "",
          age: user.age || 0,
          department: user.department.name || "",
          position: user.position || "",
          role: user.role || "",
        });

        const schedules = await getSchedulesByUserId(Number(employeeId));
        console.log("Schedules:", schedules);

        setSchedules(schedules);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [employeeId]);

  return (
    <div className="font-poppins relative -mt-40">
      <div className="scale-80 ">
        <NavigationBar accountName="Employee" />
        <button
          onClick={() => router.back()}
          className="mt-20 px-10 py-2 text-primary-color border-2 border-primary-color rounded-full 
      hover:bg-primary-color hover:text-white transition-all duration-300 ease-in-out"
        >
          ← Back
        </button>
        <div className="flex flex-col items-start mt-10">
          <h3 className="text-primary-color">
            Sense Sunset Seminyak Employee Management System
          </h3>
          <h1 className="font-bold text-4xl text-contrast-color">
            Employee Profile
          </h1>
        </div>
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-4 gap-10 mt-24 ml-45 content-center w-[95rem] scale-120 ">
            <div className="col-start-1 col-span-2 row-span-3 p-[10rem] rounded-4xl bg-primary-color"></div>
            <div className="col-start-3 col-span-2">
              <label htmlFor="fullName">Full Name</label>
              <div className="relative group">
                <input
                  type="text"
                  id="FullName"
                  name="fullName"
                  value={profileData.fullName}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-gray-50 cursor-not-allowed"
                  disabled
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
            <div className="col-start-3 row-start-2 col-span-2">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="relative group">
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profileData.phoneNumber || ""}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-gray-50 cursor-not-allowed"
                  disabled
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
            <div className="col-start-3 row-start-3 col-span-2">
              <label htmlFor="age">Age</label>
              <div className="relative group">
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={profileData.age}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-gray-50 cursor-not-allowed"
                  disabled
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
            <div className="col-start-3 row-start-4 col-span-2">
              <label htmlFor="email">Email</label>
              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-gray-50 cursor-not-allowed"
                  disabled
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
            <div className="col-start-3 row-start-5 col-span-2">
              <label htmlFor="position">Position</label>
              <div className="relative group">
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={profileData.position}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-gray-50 cursor-not-allowed"
                  disabled
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
            <div className="col-start-1 row-start-4 col-span-2">
              <label htmlFor="department">Department</label>
              <div className="relative group">
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={profileData.department}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-gray-50 cursor-not-allowed"
                  disabled
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
            <div className="col-start-1 row-start-5 col-span-2">
              <label htmlFor="role">Role</label>
              <div className="relative group">
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={profileData.role}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-gray-50 cursor-not-allowed"
                  disabled
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
          </div>
        </div>{" "}
        {/* <-- Added closing tag for the .mt-10 div */}
        <div className="flex items-center justify-between mt-[10rem]">
          <div className="flex items-center gap-10">
            <h1 className="font-bold text-4xl text-contrast-color">
              Task Report
            </h1>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border-2 border-contrast-color rounded-full 
        hover:border-primary-color transition-all duration-300 ease-in-out"
              />
            </div>
          </div>

          <div className="flex"></div>
        </div>
        <div className="mt-10 ">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-x-auto">
            <div className="grid grid-cols-4 bg-gray-100 rounded-t-lg">
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task Name
              </div>
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </div>
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </div>
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </div>
            </div>
            <div>
              {schedules.flatMap((schedule, scheduleIdx) => {
                const startDate = schedule.startTime
                  ? new Date(schedule.startTime)
                  : null;
                const endDate = schedule.endTime
                  ? new Date(schedule.endTime)
                  : null;
                const selected = selectedDate ? new Date(selectedDate) : null;
                const isSameDay = (date1: Date, date2: Date) =>
                  date1.getFullYear() === date2.getFullYear() &&
                  date1.getMonth() === date2.getMonth() &&
                  date1.getDate() === date2.getDate();

                if (
                  selected &&
                  !(
                    (startDate && isSameDay(startDate, selected)) ||
                    (endDate && isSameDay(endDate, selected))
                  )
                ) {
                  return null;
                }

                return (schedule.scheduleTasks || []).map(
                  (task: any, taskIdx: number) => (
                    <div
                      key={`${scheduleIdx}-${taskIdx}`}
                      className={`grid grid-cols-4 border-b border-gray-100 hover:bg-gray-50 transition-colors`}
                    >
                      <div className="px-6 py-4 whitespace-nowrap flex items-center">
                        {task.task.title}
                      </div>
                      <div className="px-6 py-4 whitespace-nowrap flex items-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold
                ${
                  task.task.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : task.task.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
                        >
                          {task.task.status}
                        </span>
                      </div>
                      <div className="px-6 py-4 whitespace-nowrap flex items-center">
                        {schedule.startTime
                          ? new Date(schedule.startTime).toLocaleString()
                          : "-"}
                      </div>
                      <div className="px-6 py-4 whitespace-nowrap flex items-center">
                        {schedule.endTime
                          ? new Date(schedule.endTime).toLocaleString()
                          : "-"}
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center mt-[10rem] w-full justify-between">
          <h1 className="font-bold text-4xl text-contrast-color">
            Activities Calendar
          </h1>
          <div className="relative flex items-center">
            <input
              type="month"
              value={selectedDate.slice(0, 7)}
              onChange={(e) => {
                // Set selectedDate to the first day of the selected month
                setSelectedDate(`${e.target.value}-01`);
              }}
              className="px-4 py-2 border-2 border-contrast-color rounded-full 
          hover:border-primary-color transition-all duration-300 ease-in-out"
            />
            <button
              className="px-8 py-3 bg-primary-color ml-5 text-white rounded-xl hover:opacity-80 transition-all duration-300 ease-in-out shadow-md"
              onClick={() => setLeaveRequestModalOpen(true)}
            >
              Create Leave Request
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4 mt-8 w-full">
          <div className="text-sm font-semibold text-gray-500 text-center py-2">
            MON
          </div>
          <div className="text-sm font-semibold text-gray-500 text-center py-2">
            TUE
          </div>
          <div className="text-sm font-semibold text-gray-500 text-center py-2">
            WED
          </div>
          <div className="text-sm font-semibold text-gray-500 text-center py-2">
            THUR
          </div>
          <div className="text-sm font-semibold text-gray-500 text-center py-2">
            FRI
          </div>
          <div className="text-sm font-semibold text-gray-500 text-center py-2">
            SAT
          </div>
          <div className="text-sm font-semibold text-gray-500 text-center py-2">
            SUN
          </div>

          {(() => {
            // Get month and year from selectedDate
            const selectedMonth = Number(selectedDate.slice(5, 7));
            const selectedYear = Number(selectedDate.slice(0, 4));
            const firstDayOfMonth = new Date(
              selectedYear,
              selectedMonth - 1,
              1
            );
            const startingDay = firstDayOfMonth.getDay() || 7; // Convert Sunday (0) to 7
            const daysInMonth =
              monthDays[selectedMonth as keyof typeof monthDays];

            return Array.from({ length: 42 }, (_, i) => {
              const dayNumber = i - (startingDay - 1);
              const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;

              // Get date for this cell
              let cellDate: Date | null = null;
              if (isCurrentMonth) {
                // Use UTC to avoid timezone shifting issues
                cellDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, dayNumber));
              }

              // Find schedules for this date
              let shifts: { start: string; end: string }[] = [];
              if (cellDate) {
                const cellDateStr = cellDate.toISOString().slice(0, 10);
                shifts = schedules
                  .filter((schedule) => {
                    if (!schedule.startTime) return false;
                    const scheduleDate = new Date(schedule.startTime)
                      .toISOString()
                      .slice(0, 10);
                    return scheduleDate === cellDateStr;
                  })
                  .map((schedule) => ({
                    start: schedule.startTime
                      ? new Date(schedule.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-",
                    end: schedule.endTime
                      ? new Date(schedule.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-",
                  }));
              }

              return (
                <div
                  key={i}
                  className={`
          min-h-[100px] p-4 border border-gray-200 rounded-lg
          ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
          ${
            isCurrentMonth && shifts.length > 0
              ? "cursor-pointer hover:bg-blue-50"
              : ""
          }
          `}
                  onClick={() => {
                    if (isCurrentMonth && shifts.length > 0 && cellDate) {
                      setModalInfo({
                        date: cellDate.toLocaleDateString(),
                        shifts,
                      });
                    }
                  }}
                >
                  <div className="text-lg font-medium">
                    {isCurrentMonth
                      ? dayNumber
                      : dayNumber <= 0
                      ? monthDays[
                          (((selectedMonth - 2 + 12) % 12) +
                            1) as keyof typeof monthDays
                        ] + dayNumber
                      : dayNumber - daysInMonth}
                  </div>
                  {isCurrentMonth && shifts.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1">
                      {shifts.map((shift, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                        >
                          {shift.start} - {shift.end}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>
      {/* Modal for shift info */}
      {modalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 min-w-[350px] max-w-[90vw]">
            <h2 className="text-xl font-bold mb-4">Shift Details</h2>
            <div className="mb-4">
              <div className="font-medium">Date: {modalInfo.date}</div>
              {modalInfo.shifts.map((shift, idx) => (
                <div key={idx} className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                    {shift.start} - {shift.end}
                  </span>
                </div>
              ))}
            </div>
            {/* Schedule Change / Leave Request Options */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Request</h3>
              <div className="flex flex-col gap-2">
                <button
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
                  onClick={() => {
                    setModalInfo(null);
                    setScheduleChangeModal({
                      date: modalInfo.date,
                      shifts: modalInfo.shifts,
                    });
                    setReplacementDate(""); // Reset replacement date when opening modal
                  }}
                >
                  Request Schedule Change
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="px-6 py-2 bg-primary-color text-white rounded-lg hover:opacity-80 transition"
                onClick={() => setModalInfo(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Schedule Change Modal */}
      {scheduleChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 min-w-[350px] max-w-[90vw]">
            <h2 className="text-xl font-bold mb-4">Request Schedule Change</h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                    // Find the original schedule for the selected date
                    const [month, day, year] = scheduleChangeModal.date.split("/");
                    const originalDateISO = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
                    console.log(schedules)
                    const originalSchedule = schedules.find(
                    (schedule) =>
                      schedule.date &&
                      schedule.date.slice(0, 10) === originalDateISO
                    );
                    let receiverId = "";

                    if (profileData.department) {
                      const departmentEmployees = await fetchEmployeesByDepartment(profileData.department);
                      console.log(departmentEmployees.data);
                      const head = departmentEmployees?.data.find((emp: any) => emp.role === "HEAD");
        
                      if (head) {
                        receiverId = String(head.id);
                      }
                    }
                    await createScheduleChangeRequest({
                      senderId: Number(employeeId),
                      receiverId: Number(receiverId),
                      receiverRole: "Head",
                      type: "schedule change",
                      message: scheduleChangeMessage,
                      status: "unread",
                      originalDate: originalDateISO,
                      shiftStart: scheduleChangeStart,
                      shiftEnd: scheduleChangeEnd,
                      replacementDate: replacementDate,
                      scheduleId: originalSchedule?.id || 0,
                    });
                    
                  setScheduleChangeModal(null);
                  setScheduleChangeMessage("");
                  setScheduleChangeStart("");
                  setScheduleChangeEnd("");
                  setReplacementDate("");
                  alert("Schedule change request sent!");
                } catch (err) {
                  alert("Failed to send request.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div>
                <label className="block font-medium mb-1">Date</label>
                <input
                  type="text"
                  value={scheduleChangeModal.date}
                  disabled
                  className="w-full px-3 py-2 border rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Current Shift(s)
                </label>
                {scheduleChangeModal.shifts.map((shift, idx) => (
                  <div key={idx} className="mb-1 text-sm">
                    {shift.start} - {shift.end}
                  </div>
                ))}
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Requested Start Time
                </label>
                <input
                  type="time"
                  value={scheduleChangeStart}
                  onChange={(e) => setScheduleChangeStart(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Requested End Time
                </label>
                <input
                  type="time"
                  value={scheduleChangeEnd}
                  onChange={(e) => setScheduleChangeEnd(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Replacement Date (within this month)
                </label>
                <input
                  type="date"
                  min={(() => {
                    const [day, month, year] =
                      scheduleChangeModal.date.split("/");
                    return `${year}-${month.padStart(2, "0")}-01`;
                  })()}
                  max={(() => {
                    const [day, month, year] =
                      scheduleChangeModal.date.split("/");
                    const lastDay =
                      monthDays[Number(month) as keyof typeof monthDays];
                    return `${year}-${month.padStart(2, "0")}-${String(
                      lastDay
                    ).padStart(2, "0")}`;
                  })()}
                  value={replacementDate}
                  onChange={(e) => setReplacementDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Reason / Message
                </label>
                <textarea
                  value={scheduleChangeMessage}
                  onChange={(e) => setScheduleChangeMessage(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                  placeholder="Describe your reason for the schedule change..."
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => {
                    setScheduleChangeModal(null);
                    setReplacementDate("");
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-color text-white rounded-lg hover:opacity-80 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Request Modal */}
      {leaveRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 min-w-[350px] max-w-[90vw]">
            <h2 className="text-xl font-bold mb-4">Create Leave Request</h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                await createScheduleChangeRequest({
                senderId: Number(employeeId),
                receiverRole: "HR",
                type: "leave",
                message: leaveRequestMessage,
                status: "unread",
                relatedDate: leaveRequestDate,
                scheduleId: schedules[0]?.id || 0,
                });
                setLeaveRequestModalOpen(false);
                setLeaveRequestDate("");
                setLeaveRequestMessage("");
                alert("Leave request sent!");
              } catch (err) {
                alert("Failed to send leave request.");
              } finally {
                setIsSubmitting(false);
              }
              }}
            >
              <div>
              <label className="block font-medium mb-1">Leave Date</label>
              <input
                type="date"
                value={leaveRequestDate}
                onChange={(e) => setLeaveRequestDate(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
              </div>
              <div>
              <label className="block font-medium mb-1">
                Reason / Message
              </label>
              <textarea
                value={leaveRequestMessage}
                onChange={(e) => setLeaveRequestMessage(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
                rows={3}
                placeholder="Describe your reason for leave..."
              />
              </div>
              <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                setLeaveRequestModalOpen(false);
                setLeaveRequestDate("");
                setLeaveRequestMessage("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-color text-white rounded-lg hover:opacity-80 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
