import React from 'react';
import moment from 'moment';

export default function useSignal({ room }) {
  const [archiveId, setArchiveId] = React.useState(null);
  const [renderedSesion, setRenderedSession] = React.useState(null);
  const [listOfMessages, setListOfMessages] = React.useState([]);

  const sendSignal = React.useCallback(
    (data, type) => {
      if (room) {
        room.signal({ type: type, data: data }).catch((e) => e);
      }
    },
    [room]
  );

  const signalListener = React.useCallback(({ data, isSentByMe, from }) => {
    // console.log(data);
    const date = moment(new Date().getTime()).format('HH:mm');
    addMessageToList(data, isSentByMe, from, date);
    // console.log('who sent it' + isSentByMe);
  }, []);

  const emojiHandler = ({ data, isSentByMe, from }) => {
    console.log('someone sent an emoji');
    console.log(data);
    const elementToInsertEmoji = isSentByMe
      ? 'MP_camera_publisher_default_controls'
      : from.camera.id;
    console.log('inserting emoji in ' + elementToInsertEmoji);
    const node = document.createElement('div');
    const img = document.createElement('img');
    if (data === 'thumbsup') img.src = '/thumbsup.png';
    if (data === 'thumbsdown') img.src = '/thumbsdown.png';
    if (data === 'love') img.src = '/love.png';

    img.width = '100';
    node.appendChild(img);
    // node.appendChild(document.createTextNode('\uD83D\uDE00'));
    node.classList.add('emoji');

    document.getElementById(elementToInsertEmoji).appendChild(node);

    // if (!isSentByMe) {
    //   document.getElementById(from.camera.id).appendChild(node);
    // } else {
    //   document
    //     .getElementById('MP_camera_publisher_default_controls')
    //     .appendChild(node);
    // }

    node.addEventListener('animationend', (e) => {
      console.log(e);
      removeEmoji(e.target, elementToInsertEmoji);
    });
  };

  const removeEmoji = (node, element) => {
    document.getElementById(element).removeChild(node);
  };

  const archiveListener = React.useCallback(({ data }) => {
    console.log(data);
    const archiveId = data.split(':')[0];
    const sessionRendered = data.split(':')[1];
    setArchiveId(archiveId);
    setRenderedSession(sessionRendered);
    // addMessageToList(data, isSentByMe, from, date);
    // console.log('who sent it' + isSentByMe);
  }, []);

  const addMessageToList = React.useCallback((data, isSentByMe, from, date) => {
    setListOfMessages((prev) => [...prev, { data, isSentByMe, from, date }]);
  }, []);

  React.useEffect(() => {
    if (room) {
      room.on('signal:text', signalListener);
      room.on('signal:archiveStarted', archiveListener);
      room.on('signal:emoji', emojiHandler);
    }
    return function cleanup() {
      if (room) {
        room.off('signal:text', signalListener);
        room.off('signal:archiveStarted', archiveListener);
        room.off('signal:emoji', emojiHandler);
      }
    };
  }, [room, signalListener, archiveListener]);

  // React.useEffect(() => {}, [listOfMessages]);

  return {
    sendSignal,
    listOfMessages,
    archiveId,
    renderedSesion,
    // addMessageToList
  };
}
