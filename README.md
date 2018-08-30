# devconnector

Social media network for developers

# Roadmap

- [x] Express Setup
  - [x] install `node_modules` dependencies
- [x] User API Routes & JWT Authentication
  - [x] create User model for MongoDB
  - [x] config register and login user
  - [x] setup `passport` to use `bcrypt` to hash passwords
  - [x] use Bearer tokens to generate JWTs
  - [x] create resusable `passport` middleware
- [x] Profile API Routes
  - [x] create Profile model for MongoDB
  - [x] create endpoints to create, remove, and edit profiles
  - [x] add experience and education to profile
  - [x] be able to wipe out profile (excluding posts and comments)
- [x] Post API Routes
  - [x] create Post model for MongoDB
  - [x] create and delete posts
  - [x] like and dislike posts
  - [x] comment on posts and remove comments
- [x] React and Bootstrap Setup
  - [x] bootstrap `create-react-app` with node project
  - [x] create header, slider, and footer for main page
  - [x] setup dev proxy
  - [x] use `concurrently` to run both the server and front-end
- [ ] React Router And Component State
  - [ ] setup `react-router`
- [ ] Redux and Authentication
- [ ] Dashboard and Profile State
- [ ] Profile Display
- [ ] Posts and Comments
- [ ] Prepare and Deploy
