export default defineNuxtRouteMiddleware(async () => {
  const headers = useRequestHeaders(['auth'])
  
  let user = null

  try {
    const res = await $fetch('/api/current-user', {
      headers,
      credentials: 'include'
    })

    user = res?.user ?? null
  } catch {
    user = null
  }

  // not logged in
  if (!user) {
    return navigateTo('/login')
  }

  // logged in but not staff/admin
  if (!['Staff', 'Admin'].includes(user.Role)) {
    return navigateTo('/dashboard')
  }
})
