export const API_BASE_URL = "http://192.168.1.216:4000";
export const fetchAPI = async (path: string, method: string = "GET", token?: string | null, body?: object) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`; // Ajout du token dans les headers
    }

    // Si la méthode est GET ou HEAD, on ne met pas de body
    const options: RequestInit = {
      method,
      headers,
    };

    if (method !== "GET" && method !== "HEAD" && body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, options);

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    return data;
  } catch (error) {
    console.error("❌ Erreur API:", error);
    throw error;
  }
};

