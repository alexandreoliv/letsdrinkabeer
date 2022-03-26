<div id="top"></div>

<!-- PROJECT SHIELDS -->

[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT NAME AND SCREENSHOT -->
<br />
<div align="center">
  <h3 align="center">LET'S DRINK A BEER</h3>
</div>

[![Product Name Screen Shot][product-screenshot]](https://letsdrinkabeer.herokuapp.com/)

<!-- ABOUT THE PROJECT -->

## About the project

Second project of my Full-Stack Web Development bootcamp at Ironhack. We needed to develop a full-stack web application in a week's time.

Many times in life we get stuck in the task of deciding where to meet with a group of friends. What's the nearest location for most people? What are the best neighbourhoods in town? What if we need to meet at someone's house, which person should that be? Well, Let's Drink a Beer is a social app that provides instant solutions to all these questions.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built with

-   [Express.js](https://expressjs.com/)
-   [MongoDB](https://www.mongodb.com/)
-   [Node.js](https://nodejs.org/en/)
-   [Google Maps Platform](https://mapsplatform.google.com/)
-   [Passport.js](https://www.passportjs.org/)
-   [hbs](https://www.npmjs.com/package/hbs)
-   [Cloudinary](https://cloudinary.com/)
-   [axios](https://www.npmjs.com/package/axios)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- INSTALLATION -->

## Installation

1. Clone the repo
    ```sh
    git clone https://github.com/alexandreoliv/letsdrinkabeer.git
    ```
2. Install NPM packages
    ```sh
    npm install
    ```
3. Environment variables (from MongoDB, Google Maps, Cloudinary and Github) are stored in .env files, naturally not included here. Contact me in case of issues

<p></p>

4. To run the project, type in the root folder:
    ```sh
    npm start
    ```
5. Open the web browser and enter
    ```sh
    http://localhost:3000/
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

1. In the landing page, for simplification purposes, there's no need to log in or sign up. You'll already see a map with 9 fake people, representing a group of friends.

<p></p>

2. Click on <i>"Let's Drink a Beer"</i> to see where the group should meet for a beer. You'll also see a list of nearby bars with their Google ratings.

<p></p>

3. Click on <i>"Christmas Party"</i> to see which person lives in the optimal location for the group to meet.

<p></p>

4. In case the group has preferences over the best neighbourhoods in town for a beer, click on <i>"Choose Favourite Areas"</i> and then click on your favourite areas in the map. Click on as many as you want and then on <i>"Find Closest Favourite Area"</i>. Again, you'll see a list of nearby bars with their Google ratings.

<p></p>

5. Now click on <i>"Log in"</i> and enter your Github username and password.

<p></p>

6. You'll be redirected to the landing page again, but now you'll see <i>"My Locations"</i> and <i>"Add Location"</i> on the top left. Click on <i>"Add Location"</i>.

<p></p>

7. Insert some name, address and upload a picture of that person and click on the button <i>"Add Location"</i>.

<p></p>

8. You'll see that the map has been updated and also recentred. Add as many people as necessary and then calculate the best locations for your get-together. Or click on <i>"My Locations"</i> if you need to delete or edit any of them.

<p></p>

9. As a bonus feature, you can always select two people from the drop-down menu to see the walking path between them.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- THE LOGIC BEHIND -->

## The logic behind

1. In the landing page, the map is centred so that all the people will be visible.

<p></p>

2. In the <i>"Let's Drink a Beer"</i> feature, the app starts by converting the addresses of all the people to geographic coordinates. Then it calculates the centre point by taking the average of the coordinates (for didactic purposes, this point will become a red pin on the map). But what happens if you add one person that lives far away from all the others, for instance in another city? The red pin will be far away from everybody, sometimes in the middle of nowhere. To avoid that, the app then calculates the walking distance between all people to that red pin. People with a large standard deviation get eliminated, and a new centre is calculated (the green pin). The app then shows a list of nearby bars with their Google ratings, using the Google Maps API and the green pin coordinates as reference.

<p></p>

3. In the <i>"Christmas Party"</i> feature, the app will calculate the walking distances between all the people. For instance, if everybody walks to the house of Person 1, the total sum of walking distances will be 7.1km. If everybody walks to the house of Person 2, the sum will be 8.2km. And so on. The person with the minimal sum will be the best choice for the group.

<p></p>

4. In the <i>"Choose Favourite Areas"</i> feature, instead of calculating the walking distances to the red pin, the app will calculate the sum of walking distances to each of the favourite areas. The one with the minimal sum will be the best choice for the group. Again, a list of nearby bars with their Google ratings will be shown.

<p></p>

5. In the <i>"Add Location"</i> and <i>"Edit Location"</i> features, the address field uses Google Place Autocomplete because valid Google Map locations are needed, in order to extract their geographic coordinates.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ISSUES -->

## Issues

The code reflects my level of knowledge by the time it was built (during the 6th week of the 9-week bootcamp) and hasn't been updated since.

The app is messy, full of comments and console.logs, and the callback hell is not beautiful. A lot could be improved or refactored if I decide to come back to this app in the future.

UX/UI is minimalistic as the focus was on the logic and the main features.

Keep in mind that the app already starts with 9 people, with no need to sign up or log in, for simplification purposes. Most people will (at this stage) just want to test the app.

(For didactic purposes, a yellow pin might also appear on the map, because before the green pin solution, which is better, another solution was used to calculate the final centre, using the geographic distance to the red pin, and not the walking distance. There's no need for this yellow pin to appear on the map, but it remained in the code so that both solutions could be explained during the project presentation.)

You might want to refresh the page (<i>F5</i>) to clean up the map if multiple features are used.

### Future improvements

1. Refactor code.
2. Create "Add group", "Join group" and "View groups" features. Users should be able to start a new group and send an invitation code/link for more people to join. In the current app, there's only one group, and it starts with 9 dummies already.
3. Add the possibility of choosing between cycling, driving or public transportation distances (or time consumed). At the moment all routes are calculated with the walking distance only.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/alexandre-oliv/
[product-screenshot]: images/screenshot.png
