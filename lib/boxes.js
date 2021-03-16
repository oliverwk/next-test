import crypto from 'crypto'
import jwt from 'jsonwebtoken'
if (!process.env.prod) {
  import dotenv from 'dotenv';
  dotenv.config();
}
//import config from './config.json'
import querystring from 'querystring'


export let boxMakeToken = async () => {
    let key = {
      key: process.env.privateKey,
      passphrase: process.env.passphrase
    }

    // We will need the authenticationUrl  again later,
    // so it is handy to define here
    const authenticationUrl = 'https://api.box.com/oauth2/token'

    let claims = {
      'iss': process.env.clientID,
      'sub': process.env.enterpriseID,
      'box_sub_type': 'enterprise',
      'aud': authenticationUrl,
      // This is an identifier that helps protect against
      // replay attacks
      'jti': crypto.randomBytes(64).toString('hex'),
      // We give the assertion a lifetime of 45 seconds
      // before it expires
      'exp': Math.floor(Date.now() / 1000) + 45
    }

    let keyId = process.env.publicKeyID

    // Rather than constructing the JWT assertion manually, we are
    // using the jsonwebtoken library.
    let assertion = jwt.sign(claims, key, {
      // The API support "RS256", "RS384", and "RS512" encryption
      'algorithm': 'RS512',
      'keyid': keyId,
    })
    let jwtDetails = {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: assertion,
      client_id: process.env.clientID,
      client_secret: process.env.clientSecret
    }
    let jwtBody = await querystring.stringify(jwtDetails);

    // We are using the excellent axios package
    // to simplify the API call
    let formBody = [];
    for (let property in jwtDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(jwtDetails[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    let response = await fetch(authenticationUrl, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
      method: 'POST'
    });
    let oAuth2er = await response.json();
    console.log(oAuth2er);
    globalThis.accessToken = oAuth2er.access_token;
    return accessToken;
}
export let boxGetFile = async (id) => {
  if (!globalThis.accessToken) {
    globalThis.accessToken = await boxMakeToken();
    console.log("Id:", id);
    console.log("AccessToken:", globalThis.accessToken);
    let data = await fetch(`https://api.box.com/2.0/files/${id}?fields=id%2Cname%2Cdownload_url`, {
      headers: {
        'as-user': process.env.usid,
        'Authorization': `Bearer ${globalThis.accessToken}`
      }
    });
    let json = await data.text();
    if (data.ok) {
      return JSON.parse(json);
    } else {
      console.log("BoxJson:", JSON.stringify(json));
      return {};
    }
  } else {
    console.log("Id:", id);
    console.log("AccessToken:", globalThis.accessToken);
    let data = await fetch(`https://api.box.com/2.0/files/${id}?fields=id%2Cname%2Cdownload_url`, {
      headers: {
        'as-user': process.env.usid,
        'Authorization': `Bearer ${globalThis.accessToken}`
      }
    });
    let json = await data.text()
    if (data.ok) {
      return JSON.parse(json);
    } else {
      console.log("BoxJson:", JSON.stringify(json));
      return {};
    }
  }
};
export let boxGetFolder = async (id = 132260108317) => {
  // Folder 0 is the root folder for this account
  //globalThis.accessToken = "token";
  if (!globalThis.accessToken) {
    globalThis.accessToken = await boxMakeToken();
    console.log("Id:", id); //ID: 114207700943
    console.log("AccessToken:", globalThis.accessToken);
    let data = await fetch(`https://api.box.com/2.0/folders/${id}/items/?fields=id%2Cname%2Cdownload_url&limit=60`, {
      headers: {
        'as-user': process.env.usid,
        'Authorization': `Bearer ${globalThis.accessToken}`
      }
    });
    let json = await data.text();

    if (data.ok) {
      return JSON.parse(json);
    } else {
      console.log("BoxJson:", JSON.stringify(json));
      return [];
    }
  } else {
    console.log("Id:", id); //ID: 114207700943
    console.log("AccessToken:", globalThis.accessToken);
    let data = await fetch(`https://api.box.com/2.0/folders/${id}/items/?fields=id%2Cname%2Cdownload_url&limit=60`, {
      headers: {
        'as-user': process.env.usid,
        'Authorization': `Bearer ${globalThis.accessToken}`
      }
    });
    let json = await data.text()
    //console.log("BoxJson:", JSON.stringify(json));
    if (data.ok) {
      return JSON.parse(json);
    } else {
      console.log("BoxJson:", JSON.stringify(json));
      return [];
    }
  }
}
