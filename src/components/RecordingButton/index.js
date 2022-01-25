import { useState, useContext } from 'react';
import {
  startRecording,
  stopRecording,
  render,
  stopRender,
} from '../../api/fetchRecording';

import useSignal from '../../hooks/useSignal';
import { UserContext } from '../../context/UserContext';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { IconButton } from '@material-ui/core';
import styles from './styles';
import Tooltip from '@material-ui/core/Tooltip';
import { useParams } from 'react-router';

export default function RecordingButton({ classes, room }) {
  let { roomName } = useParams();
  const { user, setUser } = useContext(UserContext);
  const { archiveId } = useSignal({ room });
  const [isRecording, setRecording] = useState(false);
  const [renderId, setRenderId] = useState(null);
  const [renderSession, setRenderSession] = useState(null);
  const localClasses = styles();

  //could be this code breaking it
  // useEffect(() => {
  //   if (renderSession) {
  //     setUser({ ...user, renderedSession: renderSession });
  //   }
  // }, [renderSession, setUser, user]);

  // const handleRecordingStart = async (sessionId) => {
  //   try {
  //     console.log('trying to start recording for' + sessionId);
  //     const data = await startRecording(sessionId);
  //     if (data.status === 200 && data.data) {
  //       const { archiveId } = data.data;
  //       setArchiveId(archiveId);
  //       setRecording(true);
  //     } else return;
  //   } catch (e) {
  //     setRecording(false);
  //   }
  // };

  //need to create a signal from the server side so that notifies me of archive started and send me the archiveId to stop it

  const startRender = async () => {
    try {
      const renderData = await render(roomName);
      if ((renderData.status = 200 && renderData.data)) {
        const { id, sessionId } = renderData.data;
        console.log(renderData.data);
        setRenderId(id);
        setRenderSession(sessionId);
        setRecording(true);
        // handleRecordingStart(renderData.data.sessionId);
      } else return;
    } catch (e) {
      console.log(e);
    }
  };

  const stopRenderAndRecording = async (renderId) => {
    if (renderId) {
      try {
        const renderData = await stopRender(renderId);
        console.log(renderData);
        if ((renderData.status = 200)) {
          handleRecordingStop(archiveId);
          setRenderId(null);
          setRenderSession(null);
        } else return;
      } catch (e) {
        console.log(e);
      }
    } else return;
  };

  const handleRecordingStop = async (archiveId) => {
    try {
      if (isRecording) {
        const data = await stopRecording(archiveId);
        console.log(data);
        if (data.status === 200 && data.data) {
          const { status } = data.data;
          setRecording(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleRecordingAction = () => {
    if (room) {
      isRecording ? stopRenderAndRecording(renderId) : startRender();
      // ? handleRecordingStop(archiveId)
      // : handleRecordingStart(sessionId);
    }
  };

  const title = isRecording ? 'Stop Recording' : 'Start Recording';

  return (
    <Tooltip title={title} aria-label="add">
      <IconButton
        edge="start"
        color="inherit"
        aria-label="mic"
        onClick={handleRecordingAction}
        className={classes.toolbarButtons}
      >
        {isRecording ? (
          <FiberManualRecordIcon
            fontSize="inherit"
            className={localClasses.activeRecordingIcon}
            style={{ color: '#D50F2C' }}
          />
        ) : (
          <FiberManualRecordIcon fontSize="inherit" />
        )}
      </IconButton>
    </Tooltip>
  );
}
