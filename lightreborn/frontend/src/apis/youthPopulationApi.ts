import { api } from "./index";

export const getYouthPopulation = async () => {
  const response = await api.get("/youth-population");
  return response.data;
};

