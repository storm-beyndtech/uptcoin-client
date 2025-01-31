// Central request function to handle different use cases
export async function sendRequest(
	endpoint: string,
	method: "GET" | "POST" | "PUT" | "DELETE",
	data: any = null,
) {
	const url = `${import.meta.env.VITE_REACT_APP_SERVER_URL}${endpoint}`;

	// Retrieve the token from localStorage
	const token = localStorage.getItem("authToken");

	let options: RequestInit = {
		method,
		headers: {},
	};

	// Add Authorization header if token exists
	if (token) {
		options.headers = {
			...options.headers,
			Authorization: `Bearer ${token}`,
		};
	}

	// Check if data is FormData or JSON
	if (data) {
		if (data instanceof FormData) {
			options.body = data;
		} else {
			// If not FormData, assume it's JSON
			options.headers = {
				...options.headers,
				"Content-Type": "application/json",
			};
			options.body = JSON.stringify(data);
		}
	}

	try {
		const response = await fetch(url, options);

		// Handle 401 Unauthorized status
		if (response.status === 401) {
			console.error("Unauthorized request, logging out...");
			throw new Error("Unauthorized. Please log in again.");
		}

		// Handle non-OK responses
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "An error occurred");
		}

		return await response.json();
	} catch (error: any) {
		console.error("Request error:", error.message);
		throw error;
	}
}
