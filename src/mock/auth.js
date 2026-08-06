import { USER_ROLES } from "@/constants/status.constants";
import { currentProvider } from "./providers";
import { currentUser } from "./users";

export const mockAuthSessions = {
  user: {
    id: currentUser.id,
    email: currentUser.email,
    name: currentUser.name,
    role: USER_ROLES.USER,
    avatar: currentUser.avatar,
    isGuest: false,
  },
  provider: {
    id: currentProvider.id,
    userId: currentProvider.userId,
    email: currentProvider.email,
    name: currentProvider.ownerName,
    businessName: currentProvider.businessName,
    role: USER_ROLES.PROVIDER,
    status: currentProvider.status,
    avatar: currentProvider.avatar,
    isGuest: false,
  },
  guest: {
    id: "guest_001",
    email: null,
    name: "Guest",
    role: USER_ROLES.USER,
    avatar: null,
    isGuest: true,
  },
};

export const VALID_OTP = ["111111", "123456"];
