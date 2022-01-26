const OpenTok = require('opentok');
const apiKey = process.env.VIDEO_API_API_KEY;
const apiSecret = process.env.VIDEO_API_API_SECRET;

const axios = require('axios');
const jwt = require('jsonwebtoken');
const e = require('cors');
if (!apiKey || !apiSecret) {
  throw new Error(
    'Missing config values for env params OT_API_KEY and OT_API_SECRET'
  );
}
let sessionId;

const opentok = new OpenTok(apiKey, apiSecret);

const createSessionandToken = (session) => {
  return new Promise((resolve, reject) => {
    opentok.createSession({ mediaMode: 'routed' }, function (error, session) {
      if (error) {
        reject(error);
      } else {
        sessionId = session.sessionId;
        const token = opentok.generateToken(sessionId);
        resolve({ sessionId: sessionId, token: token });
      }
    });
  });
};

const createRender = async (roomName) => {
  try {
    const { sessionId, token, apiKey } = await getCredentials();
    console.log(token);

    const data = JSON.stringify({
      url: `https://e579-2-220-24-117.ngrok.io/room/recorder/${roomName}`,
      // url: 'https://www.google.es/',
      sessionId: sessionId,
      token: token,
      projectId: apiKey,
      statusCallbackUrl: 'https://e579-2-220-24-117.ngrok.io/render/status',
    });

    const config = {
      method: 'post',
      url: `https://api.opentok.com/v2/project/${apiKey}/render`,
      headers: {
        'X-OPENTOK-AUTH': await generateRestToken(),
        'Content-Type': 'application/json',
      },
      data: data,
    };

    const response = await axios(config);
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const deleteRender = async (id) => {
  const config = {
    method: 'delete',
    url: `https://api.opentok.com/v2/project/${apiKey}/render/${id}`,
    headers: {
      'X-OPENTOK-AUTH': await generateRestToken(),
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const signal = (sessionId, archiveId) => {
  return new Promise((res, rej) => {
    console.log(archiveId + ' being sent');
    opentok.signal(
      sessionId,
      null,
      { type: 'archiveStarted', data: archiveId },
      (err, resp) => {
        if (!err) {
          res(resp);
        } else {
          console.log(err);
          rej(err);
        }
      }
    );
  });
};

const generateRestToken = () => {
  return new Promise((res, rej) => {
    jwt.sign(
      {
        iss: process.env.VIDEO_API_API_KEY,
        // iat: Date.now(),
        ist: 'project',
        exp: Date.now() + 200,
        jti: Math.random() * 132,
      },
      process.env.VIDEO_API_API_SECRET,
      { algorithm: 'HS256' },
      function (err, token) {
        if (token) {
          console.log('\n Received token\n', token);
          res(token);
        } else {
          console.log('\n Unable to fetch token, error:', err);
          rej(err);
        }
      }
    );
  });
};

const createArchive = (session) => {
  return new Promise((resolve, reject) => {
    opentok.startArchive(
      session,
      {
        resolution: '1280x720',
      },
      function (error, archive) {
        if (error) {
          reject(error);
        } else {
          resolve(archive);
        }
      }
    );
  });
};

const stopArchive = (archive) => {
  return new Promise((resolve, reject) => {
    opentok.stopArchive(archive, function (error, session) {
      if (error) {
        reject(error);
      } else {
        resolve(archive);
      }
    });
  });
};

const generateToken = (sessionId) => {
  const token = opentok.generateToken(sessionId);
  return { token: token, apiKey: apiKey };
};

const initiateArchiving = async (sessionId) => {
  try {
    const archive = await createArchive(sessionId);
    return archive;
  } catch (e) {
    return e;
  }
};

const stopArchiving = async (archiveId) => {
  const response = await stopArchive(archiveId);
  return response;
};

const getCredentials = async (session = null) => {
  const data = await createSessionandToken(session);
  sessionId = data.sessionId;
  const token = data.token;
  return { sessionId: sessionId, token: token, apiKey: apiKey };
};
const listArchives = async (sessionId) => {
  return new Promise((resolve, reject) => {
    const options = { sessionId };
    opentok.listArchives(options, (error, archives) => {
      if (error) {
        reject(error);
      } else {
        resolve(archives);
      }
    });
  });
};

module.exports = {
  getCredentials,
  generateToken,
  initiateArchiving,
  stopArchiving,
  listArchives,
  generateRestToken,
  createRender,
  deleteRender,
  signal,
};
