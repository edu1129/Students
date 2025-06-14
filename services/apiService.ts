import { ApiAction, StudentLoginPayload, StudentLoginResponse, StudentDetailsResponse, ApiPayload } from '../types';

// GAS_URL ko ab import.meta.env.VITE_GAS_URL se access kiya jayega

export async function callStudentApi < T extends StudentLoginResponse | StudentDetailsResponse > (
  action: ApiAction,
  payload: Omit < ApiPayload, 'action' > = {}
): Promise < T > {
  const fullPayload: ApiPayload = { action, ...payload };
  // Vite ke environment variable ko access karne ka sahi tareeka
  const gasUrl = import.meta.env.VITE_GAS_URL;
  
  if (!gasUrl) {
    // Error message ko bhi update kar diya gaya hai
    console.error("VITE_GAS_URL environment variable is not set. Please check your .env file.");
    return { success: false, error: "Application configuration error: The API URL is not set." } as T;
  }
  
  try {
    const res = await fetch(gasUrl, {
      method: 'POST',
      credentials: 'omit', // Important for GAS web apps
      headers: {
        // GAS doPost often expects plain text and then parses JSON from e.parameter.postData.contents
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(fullPayload),
    });
    
    const responseBodyText = await res.text();
    let resultJson;
    
    try {
      resultJson = JSON.parse(responseBodyText);
    } catch (e) {
      console.error(`Non-JSON response from GAS (${action}):`, responseBodyText);
      throw new Error(`Server returned an unexpected response. Status: ${res.status}`);
    }
    
    if (!res.ok || (resultJson && !resultJson.success)) {
      throw new Error(resultJson.error || resultJson.message || `API Error for ${action}. Status: ${res.status}`);
    }
    return resultJson as T;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown API error occurred.';
    console.error(`Student API Error (${action}):`, errorMessage, err);
    // Construct a failure response matching the expected structure
    return { success: false, error: errorMessage } as T;
  }
}