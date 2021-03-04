import React, { Component, useState } from "react";
var axios = require("axios");
var qs = require("qs");

var url = "http://localhost:5000/api/";

export default class API {

  static async get_articles_and_parts(inWords) {
    console.log(inWords);
    return await axios({
      url: url + "get_articles_and_parts",
      method: "GET",
      json: true,
      params: {
        words: inWords,
      },
      paramsSerializer: params => {
          return qs.stringify(params, {arrayFormat: 'comma'})
      }
    })
    .then(response => {
        var data = response.data
        var parts = data[0]["@@partSimilarity"]
        var articles = data[1]["@@articleSimilarity"]
        return [parts, articles];
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
  }

  static async get_articles_from_part(part) {
    return await axios({
      url: url + "get_articles_from_part",
      method: "GET",
      json: true,
      params: {
        part: part,
      }
    })
    .then(response => {
        var data = response.data
        var articles = data[0]["@@articleSimilarity"]
        return articles;
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
  }

  static async get_parts_from_article(article) {
    return await axios({
      url: url + "get_parts_from_article",
      method: "GET",
      json: true,
      params: {
        article: article,
      }
    })
    .then(response => {
        var data = response.data
        console.log(data);
        var parts = data[0]["@@partSimilarity"]
        console.log(parts);
        return parts;
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
  }

}
