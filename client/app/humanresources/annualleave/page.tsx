"use client";
import { useEffect, useState } from "react";
import { NavigationBar } from "../../../components/Navbar";
import EmailIcon from "@mui/icons-material/Email";
import { fetchCompleteProfile } from "../../../utils/fetchProfile";
import { fetchEmployeeLeaveInfo } from "../../../utils/fetchAttendance";
import {
  getNotificationsByRole,
  acceptNotification,
  rejectNotification,
} from "../../../utils/fetchNotification";
import { fetchUserRole } from "../../../utils/fetchAuth";

interface Notification {
  id: number;
  senderId: number;
  createdAt: string;
  status: string;
  leave: {
    leaveAmmount: number;
    leaveTotal: number;
  } | null;
}

export default function AnnualleavePage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ambil notifikasi leave request untuk HR
      const data = await getNotificationsByRole("HR");
      // Filter hanya leave request dan pastikan ada relasi leave dan sender
      const leaveRequests = (data || []).filter(
        (notif: any) => notif.type === "leave"
      );
      console.log("Fetched leave requests:", leaveRequests);
      setNotifications(leaveRequests);
    } catch (err) {
      setError("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole().then((data) => {
      if (data && data.role) {
        console.log("User role:", data.role);
        if (data.role !== "HR") {
          window.location.href = `/${data.role.toLowerCase()}`;
        }
      } else {
        window.location.href = "/";
      }
    });
    fetchLeaveRequests();
  }, []);

  const handleAccept = async (id: number) => {
    await acceptNotification(id);
    fetchLeaveRequests();
  };

  const handleReject = async (id: number) => {
    await rejectNotification(id);
    fetchLeaveRequests();
  };

  const [senderProfiles, setSenderProfiles] = useState<Record<number, any>>({});

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!notifications.length) return;
      const uniqueSenderIds = Array.from(
        new Set(notifications.map((notif) => notif.senderId).filter(Boolean))
      );

      const profiles: Record<number, any> = {};
      await Promise.all(
        uniqueSenderIds.map(async (id) => {
          try {
            const profile = await fetchCompleteProfile(id as number);
            profiles[id as number] = profile.user;
          } catch {
            profiles[id as number] = null;
          }
        })
      );
      setSenderProfiles(profiles);
    };
    fetchProfiles();
  }, [notifications]);

  // State to store leave info per senderId
  const [senderLeaveInfo, setSenderLeaveInfo] = useState<
    Record<number, { leaveAmmount: number; leaveTotal: number }>
  >({});

  useEffect(() => {
    const fetchLeaveInfos = async () => {
      if (!notifications.length) return;
      const uniqueSenderIds = Array.from(
        new Set(notifications.map((notif) => notif.senderId).filter(Boolean))
      );

      const leaveInfos: Record<
        number,
        { leaveAmmount: number; leaveTotal: number }
      > = {};
      await Promise.all(
        uniqueSenderIds.map(async (id) => {
          try {
            const leaveInfo = await fetchEmployeeLeaveInfo(id as number);
            console.log(`Leave info for ${id}:`, leaveInfo);
            leaveInfos[id as number] = {
              leaveAmmount: leaveInfo.leaveAmmount,
              leaveTotal: leaveInfo.leaveTotal,
            };
          } catch {
            leaveInfos[id as number] = { leaveAmmount: 0, leaveTotal: 0 };
          }
        })
      );
      setSenderLeaveInfo(leaveInfos);
    };
    fetchLeaveInfos();
  }, [notifications]);

  return (
    <div className="relative">
      <div className="font-poppins scale-80 -mt-20">
        <NavigationBar accountName="Human Resources" />
        <div className="flex items-center justify-between mt-30">
          <div className="flex flex-col items-start">
            <h3 className="text-primary-color">
              Sense Sunset Seminyak Employee Management System
            </h3>
            <h1 className="font-bold text-4xl text-contrast-color">
              Welcome, Human Resources
            </h1>
          </div>
          <div>
            <EmailIcon
              sx={{ fontSize: "5rem" }}
              className="text-contrast-color"
            />
          </div>
        </div>
        <div className="w-full h-[30rem] bg-primary-color mt-10 rounded-4xl shadow-sm"></div>
        <div className="flex items-center justify-center mt-10 gap-8">
          <button
            className="text-primary-color bg-orange-100 px-8 py-3 rounded-xl font-semibold shadow hover:bg-orange-200 transition-colors duration-200"
            onClick={() => {
              window.location.href = "/humanresources/dashboard";
            }}
          >
            Employee
          </button>
          <button className="text-contrast-color bg-gray-200 px-8 py-3 rounded-xl font-semibold shadow hover:bg-gray-300 transition-colors duration-200">
            Annual Leave
          </button>
          <button
            className="text-primary-color bg-orange-100 px-8 py-3 rounded-xl font-semibold shadow hover:bg-orange-200 transition-colors duration-200"
            onClick={() => {
              window.location.href = "/humanresources/attendance";
            }}
          >
            Attendance
          </button>
        </div>
        <table className="w-full table-auto mt-20">
          <thead>
            <tr className="text-contrast-color">
              <th>Name</th>
              <th>Date</th>
              <th>Leave Amount</th>
              <th>Leave Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-error-color">
                  {error}
                </td>
              </tr>
            ) : notifications.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No leave requests found
                </td>
              </tr>
            ) : (
              notifications.map((notif) => (
                <tr
                  key={notif.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-center my-2"
                >
                  <td className="py-6 px-3 text-center">
                    {senderProfiles[notif.senderId]?.fullName || "-"}
                  </td>
                  <td className="py-6 px-3 text-center">
                    {notif.createdAt
                      ? new Date(notif.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-6 px-3 text-center">
                    {senderLeaveInfo[notif.senderId]?.leaveAmmount ?? "-"}
                  </td>
                  <td className="py-6 px-3 text-center">
                    {senderLeaveInfo[notif.senderId]?.leaveTotal ?? "-"}
                  </td>
                  <td className="py-6 px-3 text-center capitalize">
                    {notif.status}
                  </td>
                  <td className="py-6 px-3 text-center">
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded-lg mr-2 hover:opacity-90 transition-opacity"
                      disabled={notif.status === "approved"}
                      onClick={() => handleAccept(notif.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:opacity-90 transition-opacity"
                      disabled={notif.status === "rejected"}
                      onClick={() => handleReject(notif.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
