import { useParams } from 'react-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { getCredentials } from '../../api/fetchCreds';
import styles from './styles.js';
import useRoom from '../../hooks/useRoom';
import { UserContext } from '../../context/UserContext';
import { useRouteMatch } from 'react-router-dom';
import useSignal from '../../hooks/useSignal';

import ToolBar from 'components/ToolBar';

import NetworkToast from 'components/NetworkToast';
import useScreenSharing from '../../hooks/useScreenSharing';

export default function VideoRoom() {
  const { user } = useContext(UserContext);
  const [credentials, setCredentials] = useState(null);
  const [error, setError] = useState(null);
  const {
    createCall,
    room,
    participants,
    connected,
    networkStatus,
    cameraPublishing,
    localParticipant,
  } = useRoom();
  const isRecorder = useRouteMatch('/room/recorder/:roomName')?.isExact
    ? true
    : false;
  const { sendSignal, drawerState, toggleDrawer } = useSignal({
    room,
    isRecorder,
  });

  const { isScreenSharing, startScreenSharing, stopScreenSharing } =
    useScreenSharing({ room });
  const roomContainer = useRef();
  const classes = styles({ isRecorder });
  let { roomName } = useParams();

  useEffect(() => {
    getCredentials(roomName)
      .then(({ data }) => {
        setCredentials({
          apikey: data.apiKey,
          sessionId: data.sessionId,
          token: data.token,
        });
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      });
  }, [roomName]);

  useEffect(() => {
    if (credentials) {
      createCall(
        credentials,
        roomContainer.current,
        user.userName,
        user.videoEffects,
        {
          ...user.defaultSettings,
        }
      );
    }
  }, [createCall, credentials, user]);

  if (error)
    return (
      <div className={classes.errorContainer}>
        There was an error fetching the data from the server
      </div>
    );

  return (
    <div id="callContainer" className={classes.callContainer}>
      <img
        width="100"
        height="100"
        style={{
          marginLeft: '20px',
          marginTop: '20px',
          position: 'absolute',
          zIndex: '1000',
        }}
        src="/vonage-avatar.png"
        alt=""
      />
      <div
        id="roomContainer"
        className={classes.roomContainer}
        ref={roomContainer}
      >
        <NetworkToast networkStatus={networkStatus} />
        <div
          id="screenSharingContainer"
          className={classes.screenSharingContainer}
        >
          {isScreenSharing && (
            <div className={classes.screenSharingOverlay}>
              You Are Screensharing
            </div>
          )}
        </div>
      </div>
      {/* {!isRecorder && ( */}
      <ToolBar
        room={room}
        participants={participants}
        localParticipant={localParticipant}
        connected={connected}
        cameraPublishing={cameraPublishing}
        isScreenSharing={isScreenSharing}
        startScreenSharing={startScreenSharing}
        stopScreenSharing={stopScreenSharing}
        isRecorder={isRecorder}
        drawerState={drawerState}
        toggleDrawer={toggleDrawer}
        isRecorder={isRecorder}
      ></ToolBar>
      // )}
    </div>
  );
}
