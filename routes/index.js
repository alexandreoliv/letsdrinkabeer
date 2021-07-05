const router = require("express").Router();

const Room = require('../models/Room');

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
  console.log('----->>> User arriving at home: ' + req.user);
  Room.find()
    .then((rooms) => res.render('index', { rooms, user: req.user, title: 'Home' }))
    .catch((err) => next(err));
});

// Our users can:
// create new rooms only when logged in
// edit and delete the rooms only if they created them (if they are the owners)
// see the list of the rooms even though they are not logged in
// Please proceed to create all the routes and files necessary to display forms and see the results after the submission.

router.post("/rooms", loginCheck(), (req, res, next) => {
  console.log('----->>> POST /rooms called');
  const { name, description, imageUrl } = req.body;
  const { _id } = req.user;
  Room
    .create ({
      name,
      description,
      imageUrl,
      owner: _id
    })
    .then(() => res.redirect('/rooms'))
    .catch((err) => next(err));
});

router.get('/rooms', loginCheck(), (req, res, next) => {
  console.log('----->>> GET /rooms called');
  const { _id } = req.user;
  Room.find({ owner: _id })
    .then((myRooms) => res.render('rooms/index', { rooms: myRooms, title: 'My Rooms' }))
    .catch((err) => next(err));
});

router.get('/rooms/new', loginCheck(), (req, res, next) => {
  console.log('----->>> GET /rooms/new called');
  res.render('rooms/new', { title: 'Add Room' })
});

router.get("/rooms/:id/edit", loginCheck(), (req, res, next) => {
  console.log('----->>> GET /rooms/:id/edit called');
    Room
    .findById(req.params.id)
    .then(room => {
      if (JSON.stringify(room.owner) === JSON.stringify(req.user._id))
        res.render('rooms/edit', { room, title: 'Edit room' })
    })
    .catch((err) => next(err));
});

router.get("/rooms/:id/delete", (req, res, next) => {
  console.log('----->>> POST /rooms/:id/delete called');
  Room
  .findById(req.params.id)
  .then(room => {
    if (JSON.stringify(room.owner) === JSON.stringify(req.user._id)) {
      Room
      .findByIdAndDelete(req.params.id)
      .then(room => {
        console.log('Room deleted');
        res.redirect('/rooms');
      })
      .catch(err => {
        console.log(err)
      })
    }
  })
  .catch((err) => next(err));
});

router.post("/rooms/:id/edit", (req, res, next) => {
  console.log('----->>> POST /rooms/:id/edit called');
  const { name, description, imageUrl } = req.body;
  Room.findByIdAndUpdate(req.params.id, {
    name,
    description,
    imageUrl
  })
	.then(room => {
    console.log(`Successully edited ${room}`);
    res.redirect('/rooms');
	})
	.catch(err => {
		console.log(err);
	})
});

module.exports = router;