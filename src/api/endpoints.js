const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const endpoint = () => {
  return {
    registration: {
      create: `${apiUrl}/register/`,
    },
    article: {
      list: `${apiUrl}/articles/`,
      detail: (slug) => `${apiUrl}/articles/${slug}/`,
    },
    announcement: {
      list: `${apiUrl}/announcements`,
      detail: (slug) => `${apiUrl}/announcements/${slug}`,
    },
  };
};
