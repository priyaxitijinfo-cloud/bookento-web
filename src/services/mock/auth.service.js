// TODO API
// login(email, password)

import { mockAuthSessions, VALID_OTP } from "@/mock/auth";
import { USER_ROLES } from "@/constants/status.constants";
import { delay } from "@/mock/helpers";

export async function login(email, password, role = USER_ROLES.USER) {
  await delay(800);
  return {
    success: true,
    data: role === USER_ROLES.PROVIDER ? mockAuthSessions.provider : mockAuthSessions.user,
  };
}

export async function register(data) {
  await delay(1000);
  return { success: true, data };
}

export async function verifyOtp(otp) {
  await delay(600);
  return { success: VALID_OTP.includes(otp) };
}

export async function forgotPassword(email) {
  await delay(800);
  return { success: true, message: "OTP sent to your email" };
}

export async function resetPassword(data) {
  await delay(800);
  return { success: true };
}

export async function logout() {
  await delay(300);
  return { success: true };
}

export async function getMe() {
  await delay(300);
  return mockAuthSessions.user;
}
