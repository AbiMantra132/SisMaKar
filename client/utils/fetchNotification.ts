const NOTIFICATION_ROUTES_ORIGIN = "http://localhost:4001/notification";

export async function createScheduleChangeRequest(data: any) {
  console.log("Creating schedule change request with data:", data);
  const res = await fetch(`${NOTIFICATION_ROUTES_ORIGIN}/schedule-change`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function acceptNotification(id: number) {
  const res = await fetch(`${NOTIFICATION_ROUTES_ORIGIN}/accept/${id}`, {
    method: "PATCH",
  });
  return res.json();
}

export async function rejectNotification(id: number) {
  const res = await fetch(`${NOTIFICATION_ROUTES_ORIGIN}/reject/${id}`, {
    method: "PATCH",
  });
  return res.json();
}

export async function getNotificationsByReceiverId(receiverId: number) {
  const res = await fetch(`${NOTIFICATION_ROUTES_ORIGIN}/receiver/${receiverId}`);
  return res.json();
}

export async function markAsRead(id: number) {
  const res = await fetch(`${NOTIFICATION_ROUTES_ORIGIN}/read/${id}`, {
    method: "PATCH",
  });
  return res.json();
}

export async function deleteNotification(id: number) {
  const res = await fetch(`${NOTIFICATION_ROUTES_ORIGIN}/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function getNotificationsBySenderId(senderId: number) {
  const res = await fetch(`${NOTIFICATION_ROUTES_ORIGIN}/sender/${senderId}`);
  return res.json();
}

export async function getNotificationsByRole(role: 'HR' | 'EMPLOYEE' | 'ADMIN' | 'HEAD') {
  const res = await fetch(`${NOTIFICATION_ROUTES_ORIGIN}/role/${role}`);
  return res.json();
}
