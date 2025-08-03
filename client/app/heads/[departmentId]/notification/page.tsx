"use client";
import { useEffect, useState } from "react";
import { NavigationBar } from "../../../../components/Navbar";
import {
  getNotificationsByReceiverId,
  markAsRead as apiMarkAsRead,
  acceptNotification as apiAcceptNotification,
  rejectNotification as apiRejectNotification,
  deleteNotification as apiDeleteNotification,
} from "../../../../utils/fetchNotification";
import { fetchEmployeesByDepartment } from "../../../../utils/fetchEmployee";
import { fetchCompleteProfile } from "../../../../utils/fetchProfile";
import { fetchUserRole } from "../../../../utils/fetchAuth";

type Notification = {
  id: number;
  senderId: number;
  receiverId?: number;
  receiverRole: string;
  type: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

interface NotificationPageProps {
  params: { departmentId: string };
}

export default function NotificationPage({ params }: NotificationPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [headId, setHeadId] = useState<number | null>(null);

  const departmentId = params.departmentId;

  // 1. Cari head dari department
  useEffect(() => {
    fetchUserRole().then((data) => {
      if (data && data.role) {
        console.log("User role:", data.role);
        if (data.role !== "HEAD") {
          if (data.role === "HR" || data.role === "HUMANRESOURCES") {
            window.location.href = "/humanresources";
          } else {
            window.location.href = `/${data.role.toLowerCase()}`;
          }
        }
      } else {
        window.location.href = "/";
      }
    });
    async function fetchHead() {
      try {
        const data = await fetchEmployeesByDepartment(departmentId, 1);
        console.log(data);
        let head = null;
        head = data?.data.find((emp: any) => emp.role === "HEAD");
        setHeadId(head?.id ?? null);
      } catch {
        setHeadId(null);
      }
    }
    fetchHead();
  }, [departmentId]);

  // 2. Gunakan department id (headId) untuk ambil notifikasi
  useEffect(() => {
    if (headId === null) return;
    async function fetchNotifications() {
      setLoading(true);
      try {
        const data = await getNotificationsByReceiverId(headId!);
        console.log("Fetched notifications:", data);
        setNotifications(Array.isArray(data) ? data : []);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [headId]);

  // Handler untuk button
  const markAsRead = async (id: number) => {
    try {
      await apiMarkAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
      );
    } catch {}
  };

  const acceptNotification = async (id: number) => {
    try {
      await apiAcceptNotification(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "accepted" } : n))
      );
    } catch {}
  };

  const rejectNotification = async (id: number) => {
    try {
      await apiRejectNotification(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "rejected" } : n))
      );
    } catch {}
  };

  const deleteNotification = async (id: number) => {
    try {
      await apiDeleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {}
  };

  const [profiles, setProfiles] = useState<any>({});

  useEffect(() => {
    async function fetchProfiles() {
      const uniqueSenderIds = Array.from(
        new Set(notifications.map((n) => n.senderId))
      );
      const profileMap: Record<number, any> = {};
      for (const id of uniqueSenderIds) {
        try {
          const profile = await fetchCompleteProfile(id);
          profileMap[id] = profile;
        } catch {
          // ignore error
        }
      }
      setProfiles(profileMap);
    }
    if (notifications.length > 0) {
      fetchProfiles();
    }
  }, [notifications]);

  // 3. Display seluruh property notifikasi dan 4 button
  return (
    <div
      className="relative font-poppins"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="scale-80">
        <NavigationBar accountName="Department Head" />
        <div className="flex items-center justify-between mt-30">
          <div className="flex flex-col items-start">
            <h3 className="text-[var(--color-primary-color)]">
              Sense Sunset Seminyak Notification Center
            </h3>
            <h1 className="font-bold text-4xl text-[var(--color-contrast-color)]">
              Notifications
            </h1>
          </div>
        </div>

        <div className="mt-16 w-full flex flex-col">
          <div className="w-full">
            {loading ? (
              <div className="text-center text-gray-500 py-20">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-20">
                No notifications found.
              </div>
            ) : (
              <ul className="space-y-6">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className="flex flex-col gap-2 p-6 rounded-2xl shadow border border-[var(--color-contrast-color)]"
                  >
                    {/* Display seluruh property */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                      <div>
                        <b>ID:</b> {notif.id}
                      </div>
                      <div>
                        <b>Sender:</b>{" "}
                        {profiles[notif.senderId]?.user?.fullName ??
                          notif.senderId}
                      </div>
                      <div>
                        <b>Type:</b> {notif.type}
                      </div>
                      <div>
                        <b>Message:</b> {notif.message}
                      </div>
                      <div>
                        <b>Status:</b> {notif.status}
                      </div>
                      <div>
                        <b>Created At:</b> {notif.createdAt}
                      </div>
                      <div>
                        <b>Updated At:</b> {notif.updatedAt}
                      </div>
                    </div>
                    {/* 4 button */}
                    <div className="flex gap-2 mt-4">
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                        onClick={() => acceptNotification(notif.id)}
                      >
                        Accept
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                        onClick={() => rejectNotification(notif.id)}
                      >
                        Reject
                      </button>
                      <button
                        className="px-4 py-2 bg-[var(--color-primary-color)] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                        onClick={() => markAsRead(notif.id)}
                      >
                        Mark as read
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                        onClick={() => deleteNotification(notif.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
