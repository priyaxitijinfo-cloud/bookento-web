// TODO API
// getAppointments()

import { appointments, providerAppointments, getAppointmentById } from "@/mock/appointments";
import { delay } from "@/mock/helpers";

export async function getAppointments() {
  await delay(400);
  return appointments;
}

export async function getProviderAppointments() {
  await delay(400);
  return providerAppointments;
}

export async function getAppointment(id) {
  await delay(300);
  return getAppointmentById(id);
}

export async function createAppointment(data) {
  await delay(800);
  return { success: true, id: `apt_${Date.now()}`, ...data };
}

export async function updateAppointmentStatus(id, status) {
  await delay(500);
  return { success: true, id, status };
}
