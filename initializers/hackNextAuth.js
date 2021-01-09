import { DeviceEventEmitter } from "react-native";

// next-auth uses addEventListener, define that so focus/blur trigger next auth listeners
window.addEventListener = (...args) => DeviceEventEmitter.addListener(...args);

let codeVerifier = null;

export function setCodeVerifierHeader(verifier) {
  codeVerifier = verifier;
}

let originalFetch = fetch;
// eslint-disable-next-line no-global-assign
fetch = (url, options = {}) => {
  // turn relative urls into absolute urls on the API path
  const modifiedUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `${process.env.API_URL}/${url.startsWith("/") ? url.slice(1) : url}`;

  if (codeVerifier) {
    options.headers = {
      "my-app-code-verifier": codeVerifier,
      'my-app-ownership': 'expo',
      ...options.headers
    };
  }

  return originalFetch(modifiedUrl, options);
};
