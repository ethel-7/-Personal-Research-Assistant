// @ts-nocheck
// This is required because the Google APIs are loaded from a script tag and not via import.
declare const gapi: any;
declare const google: any;

// ====================================================================================
// IMPORTANT: INSTRUCTIONS
// 1. You have already provided a Client ID.
// 2. You MUST replace the placeholder API_KEY below with your own Google Cloud API Key.
// 3. You can get one from the Google Cloud Console: https://console.cloud.google.com/
// 4. Ensure the "Google Drive API" and "Google Picker API" are enabled for this key.
// ====================================================================================
const CLIENT_ID = '';
const API_KEY = 'YOUR_API_KEY_HERE'; // <-- 🚨 REPLACE THIS WITH YOUR API KEY 🚨

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

let tokenClient: any;
let googleApisInitialized: Promise<{ gapi: any; gis: any; }> | null = null;

/**
 * A robust, promise-based singleton to initialize Google APIs.
 * Ensures that the APIs are loaded and initialized only once.
 * Rejects if the API_KEY placeholder is not replaced.
 */
const initializeGoogleApis = () => {
  if (googleApisInitialized) {
    return googleApisInitialized;
  }

  googleApisInitialized = new Promise((resolve, reject) => {
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        const errorMessage = "ERROR: Google Drive API Key is missing. Please replace 'YOUR_API_KEY_HERE' in services/googleDriveService.ts with your actual Google Cloud API Key.";
        console.error(errorMessage);
        return reject(new Error(errorMessage));
    }

    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = () => {
      gapi.load('client:picker', () => {
        gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        }).then(() => {
          // Now check for GIS
          const gisScript = document.createElement('script');
          gisScript.src = 'https://accounts.google.com/gsi/client';
          gisScript.async = true;
          gisScript.defer = true;
          gisScript.onload = () => {
             tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '', // Callback will be handled by individual calls
             });
             resolve({ gapi, gis: google });
          };
          gisScript.onerror = () => reject(new Error('Failed to load Google Identity Services script.'));
          document.body.appendChild(gisScript);
        }).catch((err: any) => reject(new Error('GAPI client initialization failed: ' + err.message)));
      });
    };
    gapiScript.onerror = () => reject(new Error('Failed to load Google API script.'));
    document.body.appendChild(gapiScript);
  });

  return googleApisInitialized;
};


export const initGoogleClient = async (updateFn: (isSignedIn: boolean) => void) => {
    await initializeGoogleApis();
    // No need to check for token here, will be done on picker open
    updateFn(false); // Assume signed out initially
};


export const handleAuthClick = async (updateFn: (isSignedIn: boolean) => void) => {
    await initializeGoogleApis();
    if (!tokenClient) return;

    tokenClient.callback = (tokenResponse: any) => {
        if (tokenResponse && tokenResponse.access_token) {
            gapi.client.setToken(tokenResponse);
            updateFn(true);
            showPicker(() => {}); // Re-open picker after successful sign-in
        } else {
            updateFn(false);
        }
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
};

export const showPicker = async (callback: (docs: any[]) => void) => {
  await initializeGoogleApis();
  const accessToken = gapi.client.getToken()?.access_token;
  if (!accessToken) {
    // This will trigger the sign-in flow, and the callback in handleAuthClick
    // will need to re-trigger the picker. For simplicity, we just prompt here.
    console.log("Not signed in. Prompting for authentication.");
    // A better user experience would involve a state update that tells the user to click again after signing in.
    return;
  }
  
  const view = new google.picker.View(google.picker.ViewId.DOCS);
  view.setMimeTypes("application/pdf,text/plain,text/markdown");

  const picker = new google.picker.PickerBuilder()
    .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
    .setOAuthToken(accessToken)
    .addView(view)
    .setDeveloperKey(API_KEY)
    .setCallback((data: any) => {
        if (data.action === google.picker.Action.PICKED) {
            callback(data.docs);
        }
    })
    .build();
  picker.setVisible(true);
};

export const downloadDriveFile = async (fileId: string): Promise<{name: string, content: ArrayBuffer, mimeType: string}> => {
    await initializeGoogleApis();
    const accessToken = gapi.client.getToken().access_token;
    
    // First, get the file's metadata (name and MIME type)
    const metadataRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (!metadataRes.ok) throw new Error(`Failed to fetch file metadata (${metadataRes.status})`);
    const metadata = await metadataRes.json();

    // Then, download the file's content
    const contentRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if (!contentRes.ok) throw new Error(`Failed to download file content (${contentRes.status})`);
    const content = await contentRes.arrayBuffer();

    return { name: metadata.name, content, mimeType: metadata.mimeType };
};
