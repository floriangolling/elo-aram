const express = require('express');
const app = require("express")();
const fs = require('fs');
const path = require('path');

app.use(express.static(path.join(__dirname, 'dist')));

app.get('//riot.txt', (req, res) => {
	fs.readFile('riot.txt', (e, data) => {
		if (e) {
			return res.status(404).send({message: 'file not found'});
		}
		return res.status(200).send('ccb35a2c-dc43-47ed-a997-2b59f68597d3');
	})
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000, () => {
  console.log(`app running on http://localhost:8081`);
});
