export const API_BASE_URL = "http://192.168.1.86:4000"; // Ip école

export const fetchAPI = async (path: string, method: string = "GET", token?: string | null, body?: object | void) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`; // Ajout du token dans les headers
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (method !== "GET" && method !== "HEAD" && body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, options);

    // Vérifiez si le statut HTTP indique une erreur
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Une erreur est survenue.");
    }

    // Si la réponse est vide (204 No Content), retournez un objet vide
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return {}; // Retourne un objet vide pour les réponses sans contenu
    }

    // Vérifiez si la réponse est JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json(); // Parse la réponse en JSON
    }

    // Si la réponse n'est pas JSON, retournez-la sous forme de texte brut
    return await response.text();
  } catch (error) {
    console.error("❌ Erreur API:", error);
    throw error;
  }
};

