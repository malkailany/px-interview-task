const baseUrl = 'https://60b793ec17d1dc0017b8a6bc.mockapi.io'

export async function fetchAPI (path = '', options = {}, data = {}) {
  // Merge default and user options
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const mergedOptions = {
    ...defaultOptions,
    ...options
  }
  // Build request URL
  const requestUrl = `${baseUrl}${path}`
  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions)
  // Handle response
  if (!response.ok) {
    console.log('response!', response)
    console.error(response.statusText)
    throw new Error(`An error occured please try again`)
  }
  const resData = await response.json()
  return resData
}
