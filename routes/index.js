const router = require("express").Router();

const Location = require('../models/Location');

const { fileUploader, cloudinary } = require('../config/cloudinary');

// create a middleware to check if the user is logged in
const loginCheck = () => {
  return (req, res, next) => {
    // is there a logged in user - using passport you can use req.isAuthenticated()
    console.log('checking if authenticated');
    if (req.isAuthenticated()) {
      console.log('yes, authenticated');
      // proceed as intended
      next();
    } else {
      console.log('no, not authenticated');
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
    .then((locations) => {
      if (req.user) {
        if (req.user.role === 'admin')
        res.render('index', { api_key, locations, user: req.user, admin: req.user, title: 'Home' });
        else
        res.render('index', { api_key, locations, user: req.user, title: 'Home' });
      }
      else
        res.render('index', { api_key, locations, user: req.user, title: 'Home' });
    })
    .catch((err) => next(err));
});

router.get("/getlocations", (req, res, next) => {
  console.log('----->>> GET /getlocations called: ');
  Location.find()
    .then((locations) => res.json({ locations }))
    .catch((err) => next(err));
});

router.post("/locations", loginCheck(), fileUploader.single('imageUrl'), (req, res, next) => {
  console.log('----->>> POST /locations called');
  const { name, address } = req.body;
  const { _id } = req.user;
  const imageUrl = req.file.path;
  console.log(req.file);
  Location
    .create ({
      name,
      address,
      imageUrl,
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
      if (req.user.role === 'admin')
        res.render('locations/index', { location: myLocation, admin: req.user, user: req.user, title: 'My Location' });
      else
        res.render('locations/index', { location: myLocation, user: req.user, title: 'My Location' });
        //console.log('location is ', myLocation);
    })
    .catch((err) => next(err));
});

router.get('/admin', loginCheck(), (req, res, next) => {
  console.log('----->>> GET /admin called');
  const api_key = process.env.GOOGLEMAPS_KEY;
    Location.find()
      .then((locations) => {
        if (req.user.role === 'admin')
          res.render('locations/admin', { api_key, locations, admin: req.user, user: req.user, title: 'All Locations' });
        else
          res.render('index', { api_key, locations, user: req.user, title: 'Home' })
      })
      .catch((err) => next(err));
});

router.get('/locations/new', loginCheck(), (req, res, next) => {
  console.log('----->>> GET /locations/new called');
  const api_key = process.env.GOOGLEMAPS_KEY;
  if (req.user.role === 'admin')
    res.render('locations/new', { api_key, admin: req.user, user: req.user, title: 'Add Your Location' });
  else
    res.render('locations/new', { api_key, user: req.user, title: 'Add Your Location' })
});

router.get("/locations/:id/edit", loginCheck(), (req, res, next) => {
  console.log('----->>> GET /locations/:id/edit called');
    Location
    .findById(req.params.id)
    .then(location => {
      const api_key = process.env.GOOGLEMAPS_KEY;
      if (JSON.stringify(location.owner) === JSON.stringify(req.user._id) || req.user.role === 'admin') {
        console.log('location is ', location);
        res.render('locations/edit', { api_key, location, admin: req.user, user: req.user, title: 'Edit Location' })
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

router.post("/locations/:id/edit", fileUploader.single('imageUrl'), (req, res, next) => {
  console.log('----->>> POST /locations/:id/edit called');
  const { name, address} = req.body;
  const imageUrl =  req.file.path;
  Location.findByIdAndUpdate(req.params.id, {
    name,
    address,
    imageUrl, 
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