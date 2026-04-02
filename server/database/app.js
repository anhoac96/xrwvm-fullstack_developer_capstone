const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3030;
const dataDir = path.join(__dirname, 'data');
const reviewsFile = path.join(dataDir, 'reviews.json');
const dealershipsFile = path.join(dataDir, 'dealerships.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getReviews() {
  return readJson(reviewsFile).reviews;
}

function saveReviews(reviews) {
  writeJson(reviewsFile, { reviews });
}

function getDealerships() {
  return readJson(dealershipsFile).dealerships;
}

app.get('/', (req, res) => {
  res.send('Welcome to the local dealerships API');
});

app.get('/fetchReviews', (req, res) => {
  res.json(getReviews());
});

app.get('/fetchReviews/dealer/:id', (req, res) => {
  const dealerId = Number(req.params.id);
  const documents = getReviews().filter((review) => Number(review.dealership) === dealerId);
  res.json(documents);
});

app.get('/fetchDealers', (req, res) => {
  res.json(getDealerships());
});

app.get('/fetchDealers/:state', (req, res) => {
  const state = req.params.state;
  if (state === 'All') {
    return res.json(getDealerships());
  }

  const documents = getDealerships().filter((dealer) => dealer.state === state);
  return res.json(documents);
});

app.get('/fetchDealer/:id', (req, res) => {
  const dealerId = Number(req.params.id);
  const documents = getDealerships().filter((dealer) => Number(dealer.id) === dealerId);
  res.json(documents);
});

app.post('/insert_review', (req, res) => {
  const data = req.body;
  const reviews = getReviews();
  const maxId = reviews.reduce((currentMax, review) => Math.max(currentMax, Number(review.id)), 0);
  const newReview = {
    id: maxId + 1,
    name: data.name,
    dealership: Number(data.dealership),
    review: data.review,
    purchase: Boolean(data.purchase),
    purchase_date: data.purchase_date,
    car_make: data.car_make,
    car_model: data.car_model,
    car_year: Number(data.car_year),
  };

  reviews.push(newReview);
  saveReviews(reviews);
  res.json(newReview);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
