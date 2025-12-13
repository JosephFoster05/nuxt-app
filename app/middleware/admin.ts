export default defineNuxtRouteMiddleware(async () => {
  const { user } = await $fetch('/api/current-user')

  // not logged in
  if (!user) {
    return navigateTo('/login')
  }

  // logged in but not admin
  if (user.Role !== 'Admin') {
    return navigateTo('/dashboard')
  }
})
