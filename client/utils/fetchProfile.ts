const PROFILE_ROUTES_ORIGIN = "http://localhost:4001/profile/";

export async function fetchCompleteProfile(userId: number) {
  try {
    const response = await fetch(`${PROFILE_ROUTES_ORIGIN}${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log(data)
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}