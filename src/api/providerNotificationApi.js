import api from "./axios";

export const getProviderNotifications = () =>
  api.get("/api/provider/notifications");

export const getProviderUnreadCount = () =>
  api.get("/api/provider/notifications/unread-count");

export const markNotificationRead = (id) =>
  api.put(`/api/provider/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  api.put("/api/provider/notifications/read-all");