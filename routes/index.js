const router = require("express").Router();

const Location = require('../models/Location');

// create a middleware to check if the user is logged in
const loginCheck = () => {
  return (req, res, next) => {
    // is there a logged in user - using passport you can use req.isAuthenticated()
    if (req.isAuthenticated()) {
      // proceed as intended
      next();
    } else {
      // there is no user logged in
      // we redirect to /login
      res.redirect('/login');
    }
  }
}

router.get("/", (req, res, next) => {
  const api_key = process.env.GOOGLEMAPS_KEY;
  console.log('----->>> User arriving at home: ' + req.user);
  Location.find()
    .then((locations) => res.render('index', { api_key, locations, user: req.user, title: 'Home' }))
    .catch((err) => next(err));
});

// Our users can:
// create new locations only when logged in
// edit and delete the location only if they created them (if they are the owners)
// see the list of the locations even though they are not logged in
// Please proceed to create all the routes and files necessary to display forms and see the results after the submission.

router.post("/locations", loginCheck(), (req, res, next) => {
  console.log('----->>> POST /locations called');
  const { name, address, imageUrl, lat, lng } = req.body;
  const { _id } = req.user;
  Location
    .create ({
      name,
      address,
      imageUrl,
      position: {
        lat,
        lng
      },
      owner: _id
    })
    .then(() => res.redirect('/locations'))
    .catch((err) => next(err));
});

router.get('/locations', loginCheck(), (req, res, next) => {
  console.log('----->>> GET /locations called');
  const { _id } = req.user;
  Location.find({ owner: _id })
    .then((myLocation) => {
      res.render('locations/index', { location: myLocation, title: 'My Location' });
      console.log('location is ', myLocation);
    })
    .catch((err) => next(err));
});

router.get('/locations/new', loginCheck(), (req, res, next) => {
  console.log('----->>> GET /locations/new called');
  res.render('locations/new', { title: 'Add Your Location' })
});

router.get("/locations/:id/edit", loginCheck(), (req, res, next) => {
  console.log('----->>> GET /locations/:id/edit called');
    Location
    .findById(req.params.id)
    .then(location => {
      if (JSON.stringify(location.owner) === JSON.stringify(req.user._id)) {
        console.log('location is ', location);
        res.render('locations/edit', { location, title: 'Edit Location' })
      }
    })
    .catch((err) => next(err));
});

router.get("/locations/:id/delete", (req, res, next) => {
  console.log('----->>> POST /locations/:id/delete called');
  Location
  .findById(req.params.id)
  .then(location => {
    if (JSON.stringify(location.owner) === JSON.stringify(req.user._id)) {
      Location
      .findByIdAndDelete(req.params.id)
      .then(location => {
        console.log('Location deleted:', location);
        res.redirect('/locations');
      })
      .catch(err => {
        console.log(err)
      })
    }
  })
  .catch((err) => next(err));
});

router.post("/locations/:id/edit", (req, res, next) => {
  console.log('----->>> POST /locations/:id/edit called');
  const { name, address, imageUrl, lat, lng } = req.body;
  Location.findByIdAndUpdate(req.params.id, {
    name,
    address,
    imageUrl,
    position: {
      lat,
      lng
    }
  })
	.then(location => {
    console.log(`Successully edited ${location}`);
    res.redirect('/locations');
	})
	.catch(err => {
		console.log(err);
	})
});

module.exports = router;