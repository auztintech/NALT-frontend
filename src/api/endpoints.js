// const apiUrl = import.meta.env.VITE_API_BASE_URL;

// export const endpoint = () => {
//   return {
//     registration: {
//       create: `${apiUrl}/api/register/`,
//     },
//     article: {
//       list: `${apiUrl}/api/articles/`,
//       detail: (slug) => `${apiUrl}/api/articles/${slug}/`,
//     },
//     announcement: {
//       list: `${apiUrl}/api/announcements/`,
//       detail: (slug) => `${apiUrl}/api/announcements/${slug}/`,
//     },
//   };
// };


const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const endpoint = () => {
  return {
    registration: {
      create: `${apiUrl}/api/register/`,
      update: (id) => `${apiUrl}/api/register/${id}/`,
    },
    article: {
      list: `${apiUrl}/api/articles/`,
      detail: (slug) => `${apiUrl}/api/articles/${slug}/`,
    },
    announcement: {
      list: `${apiUrl}/api/announcements/`,
      detail: (slug) => `${apiUrl}/api/announcements/${slug}/`,
    },
  };
};