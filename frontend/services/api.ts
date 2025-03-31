export const API_BASE_URL = "http://192.168.1.216:4000";

export const fetchAPI = async (path: string, method: string = "GET", body?: object, token?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Vérifier si la réponse est vide avant de parser
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || "Une erreur est survenue");
    }

    return data;
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
};
