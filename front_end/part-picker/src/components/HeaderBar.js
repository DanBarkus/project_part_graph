import { Component, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function HeaderBar() {
  const classes = useStyles();
  // for hamburger menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState();
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectMenu = (event) => {
    setSelectedMenu(event.target.innerText);
    handleClose();
  }

  return (
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          aria-controls="main-menu"
          aria-haspopup="true"
          onClick={handleMenu}
        >
          <MenuIcon />
          </IconButton>
          <Menu
            id="main-menu"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={selectMenu}>Find Projects and Parts</MenuItem>
            <MenuItem onClick={selectMenu}>Find Parts from Project</MenuItem>
            <MenuItem onClick={selectMenu}>Find Projects from Parts</MenuItem>
          </Menu> */}
        <h3>{selectedMenu}</h3>
        <h2 className={classes.title}>Project Part Picker</h2>
      </Toolbar>
    </AppBar>
  );
}

export default HeaderBar;
