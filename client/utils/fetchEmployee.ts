const EMPLOYEE_ROUTES_ORIGIN = "http://localhost:4001/employees/";


export const fetchAllEmployees = async (page: number = 1) => {
  const response = await fetch(`${EMPLOYEE_ROUTES_ORIGIN}all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page }),
  });
  return response.json();
};

export const fetchEmployeesByDepartment = async (department: string, page: number = 1) => {
  const response = await fetch(`${EMPLOYEE_ROUTES_ORIGIN}department/${department}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page }),
  });
  return response.json();
};

export const fetchEmployeesByStatus = async (status: string, page: number = 1) => {
  const response = await fetch(`${EMPLOYEE_ROUTES_ORIGIN}status/${status}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page }),
  });
  return response.json();
};

export const updateEmployeeProfile = async (employeeId: number, data: any) => {
  const response = await fetch(
    `${EMPLOYEE_ROUTES_ORIGIN}update/${employeeId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update employee profile");
  }
  return response.json();
};
