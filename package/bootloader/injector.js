import fs from "fs";
import cors from "cors";
import http from "http";
import path from "path";
import https from "https";
import express from "express";
import bodyParser from "body-parser";
import events from "events";

export class Injector {
  constructor () {
    this._g = {
      fs,
      path,
      http,
      https,
      express,
      bodyParser,
      cors,
      events
    }
  }

}