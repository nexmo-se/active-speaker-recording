const path = require('path');
let env = process.env.NODE_ENV || 'development';
const envPath = path.join(__dirname, '..');
console.log('envPath', envPath);
require('dotenv').config({ path: `${envPath}/.env.${env}` });
const cors = require('cors');
console.log('Node Running Environement:', env);
const express = require('express');
const bodyParser = require('body-parser');
const app = express(); // create express app
const opentok = require('./opentok/opentok');
app.use(cors());
app.use(bodyParser.json());

const sessions = {};

app.get('/session/:room', async (req, res) => {
  try {
    const { room: roomName } = req.params;

    console.log(sessions);
    if (sessions[roomName]?.sessionId) {
      const data = opentok.generateToken(sessions[roomName].sessionId);
      res.json({
        sessionId: sessions[roomName].sessionId,
        token: data.token,
        apiKey: data.apiKey,
      });
    } else {
      const data = await opentok.getCredentials();
      sessions[roomName] = {};
      sessions[roomName].sessionId = data.sessionId;
      res.json({
        sessionId: data.sessionId,
        token: data.token,
        apiKey: data.apiKey,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.post('/render', async (req, res) => {
  try {
    const { roomName } = req.body;
    const data = await opentok.createRender(roomName);
    console.log(data);
    const { id, sessionId } = data;
    // const roomName = url.split('/recorder/')[1];
    sessions[roomName].renderId = id;
    sessions[roomName].renderedSession = sessionId;
    // sessions[roomName].sessionId = data.sessionId;
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({ message: e });
  }
});

app.get('/render/stop/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('trying to stop render ' + id);
    const data = await opentok.deleteRender(id);
    console.log(data);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({ message: e });
  }
});

app.post('/render/status', async (req, res) => {
  let sessionToSignal;
  try {
    const { sessionId, status, id } = req.body;
    if (status === 'started') {
      for (const [key, value] of Object.entries(sessions)) {
        for (const [key_e, value_e] of Object.entries(value)) {
          if (value_e === id) {
            sessionToSignal = sessions[key].sessionId;
          }
        }
      }
      const response = await opentok.initiateArchiving(sessionId);
      console.log(response);
      const archiveId = response.id;
      const renderedSession = response.sessionId;
      if (response.status === 'started') {
        const signalResponse = await opentok.signal(
          sessionToSignal,
          `${archiveId}:${renderedSession}`
        );
      }
    }
    if (status === 'stopped') {
      console.log('stopped render');
    }
    res.status(200).send('okay');
  } catch (error) {
    console.log(error);
  }
  // res.status(200);
});

app.get('/archive/stop/:archiveId', async (req, res) => {
  const { archiveId } = req.params;
  try {
    const response = await opentok.stopArchiving(archiveId);
    console.log(response);
    res.json({
      archiveId: response,
      status: 'stopped',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.get('/archive/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const archives = await opentok.listArchives(sessionId);
    res.json(archives);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
if (env === 'production') {
  console.log('Setting Up express.static for prod');
  const buildPath = path.join(__dirname, '..', 'build');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });
}

const serverPort = process.env.SERVER_PORT || process.env.PORT || 5000;
// start express server on port 5000
app.listen(serverPort, () => {
  console.log('server started on port', serverPort);
});
