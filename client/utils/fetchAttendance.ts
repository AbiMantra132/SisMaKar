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
  if (!response.ok) {
    throw new Error('Failed to create absence');
  }
  return response.json();
};

