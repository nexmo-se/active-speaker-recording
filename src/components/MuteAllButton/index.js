import VoiceOverOffIcon from '@material-ui/icons/VoiceOverOff';
import { IconButton } from '@material-ui/core';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import Tooltip from '@material-ui/core/Tooltip';
import styles from './styles';
import useSignal from '../../hooks/useSignal';
import ThumbUpAltIcon from '@material-ui/icons//ThumbUpAlt';

export default function muteAllButton({
  handleMuteAll,
  areAllMuted,
  classes,
  room,
}) {
  const localClasses = styles();
  const { sendSignal } = useSignal({ room });
  const title = 'Add reaction';

  const addEmoji = () => {
    sendSignal('emoji', 'emoji');
  };

  return (
    <Tooltip title={title} aria-label="add">
      <IconButton
        edge="start"
        color="inherit"
        aria-label="videoCamera"
        onClick={addEmoji}
        className={classes.toolbarButtons}
      >
        <ThumbUpAltIcon />
      </IconButton>
    </Tooltip>
  );
}
