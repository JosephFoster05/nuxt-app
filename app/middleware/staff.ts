export default defineNuxtRouteMiddleware(async () => {
  const { user } = await $fetch('/api/current-user')

  // not logged in
  if (!user) {
    return navigateTo('/login')
  }

  // logged in but not staff/admin
  if (!['Staff', 'Admin'].includes(user.Role)) {
    return navigateTo('/dashboard')
  }
})
