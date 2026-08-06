export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Bookento",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  description: "Multi Service Provider Platform",
};

export const AUTH_CONFIG = {
  userAccessTokenCookie: "bookento_user_token",
  providerAccessTokenCookie: "bookento_provider_token",
  userRefreshTokenCookie: "bookento_user_refresh",
  providerRefreshTokenCookie: "bookento_provider_refresh",
  accessTokenMaxAge: Number(process.env.JWT_ACCESS_TOKEN_MAX_AGE ?? 86400),
  refreshTokenMaxAge: Number(process.env.JWT_REFRESH_TOKEN_MAX_AGE ?? 604800),
};

export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
};

export const UPLOAD_CONFIG = {
  maxFileSize: Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE ?? 10485760),
  allowedImageTypes: (process.env.NEXT_PUBLIC_ALLOWED_IMAGE_TYPES ??
    "image/jpeg,image/png,image/webp").split(","),
  allowedVideoTypes: (process.env.NEXT_PUBLIC_ALLOWED_VIDEO_TYPES ??
    "video/mp4,video/webm").split(","),
};

export const VALID_OTP_CODES = ["111111", "123456"];
