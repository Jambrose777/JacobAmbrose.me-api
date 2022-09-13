const express = require('express');
const morgan = require('morgan');
const nodemailer = require('nodemailer');

const app = express();
const port = 8080;

app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify().then(console.log).catch(console.error);

app.post('/email', async (req, res) => {
  if (!req.body || !req.body.name || !req.body.email || !req.body.text) {
    res.status(400).json({message: 'must provide name, email, and text.'});
  } else {
    transporter.sendMail({
      from: `"${req.body.name}" <${process.env.EMAIL_USER}>`,
      replyTo: req.body.email,
      to: process.env.EMAIL_USER,
      subject: "JacobAmbrose.me Contact Form",
      text: req.body.text,
    })
    .then(info => {
      res.send({ status: 'success'});
    })
    .catch(console.error);
  }
});

app.get('/', async (req, res) => {
  res.send({ status: 'healthy'});
});

app.listen(port, function() {
  console.log(`listening on port ${port}!`)
});
