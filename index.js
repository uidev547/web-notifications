const webpush = require('web-push');

// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

console.log('vapidKeys', vapidKeys);
const apiKey = 'AAAAz8ua_Ms:APA91bGqCEHBK6CjpuLPbULwAmstnZXZuFCVzcRnUKMmD4qQ4pg3iWV_Df9RS-Ea_vj_awH9UkP3eS07H-ec16k0eZLiGOWk2cOnbE2oIHJwYOOb_hzq63T9z8CDfxXvPAu4Y_ePJEGN';

webpush.setGCMAPIKey(apiKey);
webpush.setVapidDetails(
  'mailto:kiran.adepu@imaginea.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// This is the same output of calling JSON.stringify on a PushSubscription
const firefox = {
    "endpoint": "https://updates.push.services.mozilla.com/wpush/v1/gAAAAABZprrDHc2aZ9R_o2uFLcAA13wQRU-c_SqvHnvZKbmh4OC5xl1iFSW8IobfOaMPjQOqJKjNK3rtS_5O5GD-AUqhLjPbsc2evmBcrzvdVCMFoTRyPeq8YPuN_u96_aPGH5Ye8Ww1",
    "keys": {
        "auth": "62TI5k2aGS3YKFm0SebVnw",
        "p256dh": "BAx8voxgyoD0FZufdBD-nSa-hwP0LLahF7e-MMgTxsa56QEVy1MJlECmbBAwtsSR_yUfZHQNk9F1GEVQ7JqMqsQ"
    }
};

const chrome = {
    "endpoint": "https://android.googleapis.com/gcm/send/cVWrg6I06MI:APA91bFw9XmpqRg-A9RwxgZAh7_pAZjBCdvHz0bSRkf-Xty3QY8AgTd9OYLugFyXtYW091q-WBxjbYDl5MuxjVRMupvecuPl__rIBW8gmeq3ZR-oe6CKKMuLwOonUngTnZ3ZTilGRrHT",
    "keys": {
        "p256dh": "BDSLMwtjYmRL_AODb6rcEWe61G_1Qh-5bMJrP6D8Uv_8mwRTqUsFFd59dyotBmuREeXWS8v6kIXPCAIdd1-GvPg=",
        "auth": "Lvouq3inOJNcmVM57BH5zg=="
    }
}
;

const sub3 = {
	"endpoint": "https://android.googleapis.com/gcm/send/ft-oi0wbMCo:APA91bFsc6psSd1bc3ooYJ77R4TTArWtI-3icPecXITeRmYntdfnAjFqQe-tTdYQDB_17xtcdqipNaltK7R-h8dBrzVgnreo-RT2_xqlLamo-hFHlkekVOcCBR6fDpqMv7KTvnVR8dad",
	"keys": {
		"p256dh": "BOJGameVM3cBnrvIRRf1-IN9dzo-COhqwsaASe0AVCHpNe2U5ftMq0ohDU-73kbmlxE2te8PVIqsuBNyQ-JHgWY=",
		"auth": "Rcjxu90szfOa1Z3vwoQVCQ=="
	}
};

const mylap = {
    "endpoint": "https://android.googleapis.com/gcm/send/etiQF41jaV4:APA91bH3DBrX_T--bHrUdrxurzI5Evu0PcffMprhtobiOJJy7ZoImpnC5te-I0oamJLcPMziB5G0bHwK8825GPeOqmXptdHYvDaSo8Uy9FRSPxx9GhI5v5bVJ--bOYW91RVpPxqZHbAc",
    "expirationTime": null,
    "keys": {
        "p256dh": "BCLmwD5lbKfMMPmp1wZjtd05B7N-0hklOBm7d2TpP4GF5hzjhITwvalcYuhofq--rPNVK228Uh5ytrf2cas5rQk=",
        "auth": "uNbDEL80Dh5MXI1Cpy6FvA=="
    }
}

const mymobile = {
    "endpoint": "https://android.googleapis.com/gcm/send/cIDI6DeeOA0:APA91bHDG2kF7oxgWob3dDAKEcB4sy3R_6zUQ9wsr2xrfOxmVV0R2sqs07GCJqqWgiwOxc0g29mpwpuHwf6vgXvwz6BMPwqRjZfD-BU2nH2D4kyvWyZJSruLymV-MDT8OZYY7xdlQZ08",
    "expirationTime": null,
    "keys": {
        "p256dh": "BOPqZ8QqBh2yecuQTD9CeXZS2_pG_ZL9lDyCwadNoWIvod5Hy_ccbjHWwWmz47KXnkkt3rATzGhZ1KS4ts445wE=",
        "auth": "SJRlmniQYkXw9ek8QiHKdQ=="
    }
};

const resposne = {
    title: "My Notificaition Title",
    body: "My nofication body"
}

webpush.sendNotification(firefox, JSON.stringify(resposne));
webpush.sendNotification(chrome, JSON.stringify(resposne));
// webpush.sendNotification(mylap, 'Your Push Payload Text');
// webpush.sendNotification(mymobile, 'Your Push Payload Text');
