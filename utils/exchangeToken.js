import { setCodeVerifierHeader } from "../initializers/hackNextAuth";
import qs from "qs";
import { DeviceEventEmitter } from "react-native";

export default async function exchangeToken(
  providerId,
  request,
  response
) {
  setCodeVerifierHeader(request?.codeVerifier);
  const params = { ...(response).params };
  delete params['state']
  try {
    const url = `${process.env.API_DOMAIN}/api/auth/callback/${providerId}?${qs.stringify(params)}`
    await fetch(url, {
      headers: {
        'my-app-ownership': 'expo'
      }
    })
  } catch (e) {
    // Redirects can cause errors that we can ignore
    // TODO: distinguish these from failed logins and show an error
    // console.log(e);
    console.log('e.message', e.message);
  } finally {
    setCodeVerifierHeader(null);
  }
  DeviceEventEmitter.emit("focus");
}
