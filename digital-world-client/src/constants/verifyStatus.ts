export const VERIFY_STATUS = {
  UNVERIFIED: 0,
  VERIFIED: 1,
  BANNED: 2
}

export const VERIFY_STATUS_LABELS: { [key: number]: string } = {
  0: '❌ Chưa xác thực',
  1: '✅ Đã xác thực',
  2: '🔒 Bị khóa'
}
