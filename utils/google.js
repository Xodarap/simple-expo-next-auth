// import { Button } from "../components/Button";
import {
  Prompt,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import Constants from "expo-constants";
import React from "react";
import { Button, Text } from "react-native";
import exchangeToken from "./exchangeToken";
import { useState } from "react";
import Networking from 'react-native/Libraries/Network/RCTNetworking';

const useProxy = Constants.appOwnership === "expo";

export default function GoogleLogIn() {
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState();

  // Sometimes the cookies get corrupted,, so cleaar them before
  // trying anything. Also this crashes on android if you don't
  // Provide a callback; I don't know why.
  Networking.clearCookies(() => {})
  
  const discovery = useAutoDiscovery("https://accounts.google.com");
  const [request, response, promptAsync] = useAuthRequest(
    {
      expoClientId: process.env.GOOGLE_ID,
      clientId: process.env.GOOGLE_ID,
      redirectUri: makeRedirectUri({
        // native,
        useProxy: true,
      }),
      scopes: ["openid", "profile", "email"],

      // Optionally should the user be prompted to select or switch accounts
      prompt: Prompt.SelectAccount,
      usePKCE: false
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") { 
      exchangeToken("google", request, response).then(() => {

        // At this point, we should be authenticated. Test this out
        // by making a request to an endpoint that requires authentication
        fetch(process.env.API_DOMAIN + process.env.TEST_PATH)
          .then(async response => {
            if (!response.ok) {
              setAuthenticated(false)
              console.log('Error in secondary API call:', JSON.stringify(await response.json()))
              return
            }
            const responseData = await response.json()
            setData(responseData)
            setAuthenticated(true)
          })
      });
    }
  }, [response]);

  return (<>
    {(!authenticated) && <Button
      disabled={!request}
      onPress={() => {
        promptAsync({ useProxy });
      }}
      title="Login with Google"
    />}

    {authenticated && <Text>Successfully authenticated! Response: {JSON.stringify(data)}</Text>}
  </>);
}
