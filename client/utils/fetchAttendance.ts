// filepath: c:\Users\ABI\SisMakar\client\utils\fetchAttendance.ts

const ABSENCE_ROUTES_ORIGIN = "http://localhost:4001/absence/";

export const createAbsence = async (absenceData: any) => {
  const response = await fetch(ABSENCE_ROUTES_ORIGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(absenceData),
  });

  console.log("Creating absence with data:", absenceData);
  if (!response.ok) {
    throw new Error('Failed to create absence');
  }
  return response.json();
};

export const fetchAttendanceSummary = async (params: {
  startDate: Date | string;
  endDate: Date | string;
}) => {
  const response = await fetch(ABSENCE_ROUTES_ORIGIN + 'summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate: params.startDate,
      endDate: params.endDate,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch attendance summary');
  }
  return response.json();
};

export const fetchDetailedMonthAttendanceSummary = async (params: {
  startDate: Date | string;
  endDate: Date | string;
}) => {
  const response = await fetch(ABSENCE_ROUTES_ORIGIN + 'detailed-summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate: params.startDate,
      endDate: params.endDate,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch detailed month attendance summary');
  }
  return response.json();
};

export const fetchAttendanceDepartementSummaryDaily = async (params: {
  startDate: Date | string;
  endDate: Date | string;
}) => {
  const response = await fetch(ABSENCE_ROUTES_ORIGIN + 'department-summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate: params.startDate,
      endDate: params.endDate,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch department attendance summary');
  }
  return response.json();
};

export const fetchEmployeeAttendance = async (params: {
  startDate: Date | string;
  endDate: Date | string;
  departmentName?: string;
}) => {
  const response = await fetch(ABSENCE_ROUTES_ORIGIN + 'employee-attendance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate: params.startDate,
      endDate: params.endDate,
      departmentName: params.departmentName,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch employee attendance');
  }
  return response.json();
};
export const fetchEmployeeLeaveInfo = async (userId: number) => {
  const response = await fetch(ABSENCE_ROUTES_ORIGIN + 'employee-leave-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch employee leave info');
  }
  return response.json();
};
