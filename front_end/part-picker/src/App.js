import React, { useState } from "react";
import { makeStyles, createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import API from "./components/API";
import HeaderBar from "./components/HeaderBar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Box from "@material-ui/core/Box";
import "./App.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#9a67ea',
      main: '#673ab7',
      dark: '#320b86',
      contrastText: '#fff',
    },
    secondary: {
      light: '#fff7ff',
      main: '#d1c4e9',
      dark: '#a094b7',
      contrastText: '#000',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  lists: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#eeeeee",
    position: "relative",
    overflow: "auto",
    maxHeight: "60vh",
    margin: "auto",
  },
  listItem: {
    backgroundColor: theme.backgroundColor,
  },
  background: {
    width: "100%",
    height: "100vh",
  },
  searchBar: {
    margin: "20px",
  },
  loadingIcon: {
    display: "block",
    position: "fixed",
    height: "200px",
    left: "50%",
    top: "10%",
    transform: "translateX(-50%)"
  }
}));

function App() {
  const classes = useStyles();
  const [input, setInput] = useState();
  const [words, setWords] = useState();
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [articles, setArticles] = useState([]);

  // handling text inpu
  function handleChange(e) {
    var parsedWords = e.target.value.split(" ");
    setWords(parsedWords);
    setInput(e.target.value);
  }

  function handleExpand(listElem) {
    listElem.selected = !listElem.selected;
    console.log(listElem.selected);
    var partIndex = parts.findIndex((x) => x.name === listElem.name);
    var tempParts = parts;
    console.log(partIndex);
    tempParts[partIndex] = listElem;
    setParts(tempParts);
  }

  // most likely not needed
  // used to add 'selected' key to data jsons
  function setUpLists(response) {
    var parts = response[0];
    var articles = response[1];
    for (var i = 0; i < parts.length; i++) {
      parts[i]["selected"] = false;
    }
    for (var v = 0; v < articles.length; v++) {
      articles[v]["selected"] = false;
    }
    setParts(parts);
    setArticles(articles);
  }

  async function searchPartsAndArticles() {
    setLoading(true);
    var ret = API.get_articles_and_parts(words);
    ret.then((response) => {
      setLoading(false);
      setUpLists(response);
    });
  }

  async function searchArticlesFromPart(part) {
    setLoading(true);
    var ret = API.get_articles_from_part(part);
    ret.then((response) => {
      setLoading(false);
      console.log(response);
      setArticles(response);
    });
  }

  async function searchPartsFromArticle(article) {
    setLoading(true);
    var ret = API.get_parts_from_article(article);
    ret.then((response) => {
      setLoading(false);
      console.log(response);
      setParts(response);
    });
  }
  
  // Parts scroller -- this should be moved to its own component
  var showParts = parts.map((parts) => {
    var url = "";
    // parts from Pololu have a 'p' at the beginning to tell them apart
    // use that p to select proper link
    switch (parts.name.charAt(0)) {
      case "p":
        url = "https://www.pololu.com/product/";
        break;
      default:
        url = "https://www.adafruit.com/product/";
    }
    return (
      <div>
        <ListItem
          button
          key={parts.name}
          className={classes.listItem}
          onClick={() => handleExpand(parts)}
        >
          {parts.description}
          <br />
        </ListItem>
        {!parts.selected && (
          <ListItem>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs></Grid>
              <Grid item xs={5}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => searchArticlesFromPart(parts.name)}
                >
                  Get Related Articles
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={(event) => {
                    var name = parts.name;
                    // remove the 'p' from pololu part #'s so the links work
                    switch (parts.name.charAt(0)) {
                      case "p":
                        name = parts.name.substring(1);
                        break;
                      default:
                        name = parts.name;
                        break;
                    }
                    console.log(name);
                    window.open(url + name);
                  }}
                >
                  View Part
                </Button>
              </Grid>
            </Grid>
          </ListItem>
        )}
        <Divider />
      </div>
    );
  });

  // Articles scroller -- this should be moved to its own component
  var showArticles = articles.map((articles) => {
    var url = "https://hackaday.com/?p=";
    return (
      <div>
        <ListItem
          button
          key={articles.name}
          className={classes.listItem}
          onClick={() => handleExpand(articles)}
        >
          {articles.description}
          <br />
        </ListItem>
        {!articles.selected && (
          <ListItem>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs></Grid>
              <Grid item xs>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => searchPartsFromArticle(articles.name)}
            >
              Get Related Parts
            </Button>
            </Grid>
            <Grid item xs>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={(event) => {
                window.open(url + articles.name);
              }}
            >
              View Article
            </Button>
            </Grid>
            </Grid>
          </ListItem>
        )}
        <Divider />
      </div>
    );
  });



  return (
    <ThemeProvider theme={theme}>
    <div className="App">
        <HeaderBar />
        { loading ? <img className={classes.loadingIcon} src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"/> : null}
        <Box className={classes.background}>
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="flex-start"
          >
            <Grid
              className={classes.searchBar}
              item
              container
              xs={12}
              justify="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <p>Search for Multiple Words</p>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="search_terms"
                  label="search"
                  variant="filled"
                  helperText="words separated by spaces"
                  value={input}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item>
                <Button
                  id="search"
                  variant="contained"
                  color="primary"
                  onClick={searchPartsAndArticles}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <h2>Parts</h2>
              <List className={classes.lists}>{showParts}</List>
            </Grid>
            <Grid item xs={6}>
              <h2>HackADay Articles</h2>
              <List className={classes.lists}>{showArticles}</List>
            </Grid>
          </Grid>
        </Box>
    </div>
    </ThemeProvider>
  );
}

export default App;
