export default defineNuxtRouteMiddleware(async () => {
  const { user } = await $fetch('/api/current-user')

  if (!user) {
    return navigateTo('/login')
  }

  // logged in but not admin
  if (user.Role !== 'Admin') {
    return navigateTo('/dashboard')
  }
})
