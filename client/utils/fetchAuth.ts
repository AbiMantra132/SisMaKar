const AUTH_ROUTES_ORIGIN = "http://localhost:4001/auth/";

// login user
export async function fetchLogin(credentials: { email: string; password: string }) {
  try {
    const response = await fetch(`${AUTH_ROUTES_ORIGIN}login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// sign up user
export async function fetchSignup(userData: {
  email: string;
  password: string;
  fullName: string;
  age: number;
  department: string;
  position: string;
  phoneNumber: string;
}) {
  try {
    // Map department to corresponding code
    const departmentMap: Record<string, string> = {
      IT: '1',
      HK: '2',
      SALES: '3',
      FO: '4',
      "F&B": '5',
      ENG: '6',
      HR: '7',
      ACC: '8',
    };

    const payload = {
      ...userData,
      department: departmentMap[userData.department] || userData.department,
    };

    console.log(payload);

    const response = await fetch(`${AUTH_ROUTES_ORIGIN}signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

// verify user session
export async function fetchVerify() {
  try {
    const response = await fetch(`${AUTH_ROUTES_ORIGIN}verify`, {
      credentials: 'include',
    });

    return await response.json();
  } catch (error) {
    console.error('Verify error:', error);
    throw error;
  }
}

// Get User Role
export async function fetchUserRole() {
  try {
    const response = await fetch(`${AUTH_ROUTES_ORIGIN}role`, {
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    console.error('Fetch user role error:', error);
    throw error;
  }
}