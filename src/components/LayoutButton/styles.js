import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  choosen: {
    backgroundColor: theme.palette.primary.main,
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
  emoji: {
    minWidth: '96px',
    minHeight: '96px',
    fontSize: '88px',
    position: 'absolute',
    animation: 'surfing 7s 1',
    // marginLeft: '20vw',
    zIndex: '10000',
  },
}));
