const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const endpoint = () => {
  return {
    registration: {
      create: `${apiUrl}/api/register/`,
      update: (id) => `${apiUrl}/api/register/${id}/`,
      certificate: `${apiUrl}/api/register/certificate/`,
    },
    article: {
      list: `${apiUrl}/api/articles/`,
      detail: (slug) => `${apiUrl}/api/articles/${slug}/`,
    },
    announcement: {
      list: `${apiUrl}/api/announcements/`,
      detail: (slug) => `${apiUrl}/api/announcements/${slug}/`,
    },
    paper: {
      create: `${apiUrl}/api/papers/`,
      list: `${apiUrl}/api/papers/list/`,
    },
  };
};