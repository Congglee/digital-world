export const accountsVerifyStatus = {
  unverified: 0,
  verified: 1,
  banned: 2
}

export const accountsVerifyStatusLabels: { [key: number]: string } = {
  0: '❌ Chưa xác thực',
  1: '✅ Đã xác thực',
  2: '🔒 Bị khóa'
}
