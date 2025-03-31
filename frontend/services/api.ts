export const API_BASE_URL = "http://192.168.1.216:4000";
export const fetchAPI = async (path: string, method: string = "GET", body?: object, token?: string) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`; //  Ajout du token dans les headers
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      console.error("🚨 Erreur API :", data);
      throw new Error(data.message || "Une erreur est survenue");
    }

    return data;
  } catch (error) {
    console.error("❌ Erreur API:", error);
    throw error;
  }
};
