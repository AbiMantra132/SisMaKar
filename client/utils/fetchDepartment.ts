const DEPARTMENT_ROUTES_ORIGIN = "http://localhost:4001/department/";

export async function fetchDepartmentHeadId(name: string): Promise<{ headId: string | null }> {
  const response = await fetch(
    `${DEPARTMENT_ROUTES_ORIGIN}head-id/${encodeURIComponent(name)}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch department head id for ${name}`);
  }
  return response.json();
}