## API

### Create Room

Get `session/:roomName`

Response body

```
{
    "sessionId": "1_MX40NjI2NDk1Mn5-MTYyMjAyODA3OTgwOH44Tmd0VXR3dGlVdG1ZYjVpeDVXNGxMOGN-fg",
    "token": "T1==cGFydG5lcl9pZD00NjI2N.......",
    "apiKey": "1234566"
}
```

### Stop Recording

GET `archive/stop/:archiveId`

Response body

```
{
    "archiveId": "b67d02b5-c32e-4ea8-b82a-ba6c89edde59",
    "status": "stopped"
}
```

### Start Render

POST `render`

Request body

```
{
    "roomName" : "testRoom"
}
```

Response body

```
{
    "id": "37ecf614-5e8f-493d-b328-cec826f9154a",
    "projectId": "47396501",
    "sessionId": "1_MX40NzM5NjUwMX5-MTY0MzI4MTc2MTMyMn5MelNSTTFDQUh6QnorZFZTR1hiK3FJaTh-fg",
    "createdAt": 1643281761658,
    "updatedAt": 1643281761658,
    "url": "https://e579-2-220-24-117.ngrok.io/room/recorder/testroom",
    "status": "starting",
    "callbackUrl": "https://e579-2-220-24-117.ngrok.io/render/status",
    "resolution": "1280x720"
}
```

### Stop Render

GET `render/stop/:renderId`

Response body

```
HTTP 200
```

### Render Status Listener

POST `render/status`

Request body

```
{
    "streamId": "21c79631-ee73-43d6-aad6-c5c4fd616850",
    "id": "37ecf614-5e8f-493d-b328-cec826f9154a",
    "sessionId": "1_MX40NzM5NjUwMX5-MTY0MzI4MTc2MTMyMn5MelNSTTFDQUh6QnorZFZTR1hiK3FJaTh-fg",
    "status": "started"
}
```

Response body

```
{
    HTTP 200
}
```

### List Archives

GET `archive/:sessionId`

Response body

```
[
    {
        "id": "b67d02b5-c32e-4ea8-b82a-ba6c89edde59",
        "status": "available",
        "name": "",
        "reason": "user initiated",
        "sessionId": "1_MX40NjI2NDk1Mn5-MTYyMjAzNjM4Nzk1NX4xV1Vkd25RMWwyZkRicWtLVGNVd1BVd2t-fg",
        "projectId": 1234567,
        "createdAt": 1622039724000,
        "size": 19262817,
        "duration": 66,
        "outputMode": "composed",
        "hasAudio": true,
        "hasVideo": true,
        "sha256sum": "4l6MKdPeiCOnt1UaQWMBSovKcTrg+Co5eNsyUp7Q/Jo=",
        "password": "",
        "updatedAt": 1622039794000,
        "resolution": "640x480",
        "partnerId": 1234567,
        "event": "archive",
        "url": "https://s3.eu-west-1.amazonaws.com/..."
    }
]
```
