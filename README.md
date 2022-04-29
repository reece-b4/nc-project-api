<h1 align="center">Welcome to Reece Balfour's repo of Team PTP's Part Time Pet API 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/northcoders/be-nc-news#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
</p>

Borrow a bear; lend a llama. A pet sharing app for mobile devices.
 <br>
 <br>
Our app is aimed at a wide demographic and offers a solution to 
people who don't want or are unable to commit to full time pet 
ownership. Pet companionship and time spent with pets can be a 
great boost to mental health and this app aims to make pets more 
accessible to everyone.
You can search for pets using various queries and then organise 
your pet shares using our real-time messaging feature. You can 
leave reviews on other users’ profiles and add, edit and delete pets 
on your own.

This API repo interacts with users and pets data in the Part Time Pet Firebase Firestore database:
Endpoints include:
"GET /users"
"POST /users"
"GET /users/:userId"
"DELETE /users/:userId"
"PATCH /users/:userId"
"GET /users/:userId/reviews"
"POST /users/:userId/reviews"
"GET /users/:userId/pets"
"GET /users/:userId/pets"
"DELETE /users/:userId/reviews"
"PATCH /pets"
"GET /pets/:petId"
"PATCH /pets/:petId"
"DELETE /pets/:petId"

Queries of:
species, max distance from user and a regex matching search input can be made on "PATCH /pets"


## Full Project Tech Stack
Flutter, Firebase, Firestore, Express, Nodejs, Mocha, Chai

Minimum version of Node: 16.13.2
<br>

## Links

To watch a video of the app in use please go to:
## 📹 [Youtube short-video](https://youtu.be/expn-N1t7L4)
## 📹 [Northcoders full demo-video](https://northcoders.com/projects/april-2022/part-time-pet)
<br>

## 🖥️ [Back-end Git Repo](https://github.com/reece-b4/nc-project-api) 
## 🖥️ [Back-end hosted API](https://nc-project-api.herokuapp.com/api/users)

## 🖥️ [Front-end Git Repo](https://github.com/reece-b4/nc_project)
 <br>

## Cloning repo (link above)
Copy code url from github <br>
In required directory:
```sh
 git clone <url>
```

## Install Dependencies
```sh
npm install
```

## Author

👤 **ReeceBalfour**

* Github: [@reece-b4](https://github.com/reece-b4)
