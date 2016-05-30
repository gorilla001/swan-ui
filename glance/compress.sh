#! /bin/bash

rm -rf build/*
npm install --global gulp
npm install
gulp
