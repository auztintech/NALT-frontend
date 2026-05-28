const apiUrl = import.meta.env.VITE_API_URL;

export const endpoint = () => {
  return {
    registration: {
      create: `${apiUrl}/register/`,
    },
  };
};
