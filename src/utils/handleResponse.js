export const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || 'Request failed');
  }
  return res.json();
};