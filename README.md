# Group13

[![Netlify Status](https://api.netlify.com/api/v1/badges/6d0ed3bf-f7a4-4f80-9de9-af123b810525/deploy-status)](https://app.netlify.com/sites/have-a-challenge/deploys)


1. run `npm -install` to install necessary packages. 
2. run `npm run -[any key under scripts:]` to run 



Our app:

Our app is built around the idea that a daily health challenge that isn't too hard will motivate people to consciously thing about their health more. 

Our app is hosted on Netlify, and the process starts at the Signup page. The signup page requires an email and password to enter into the app's homepage. 

The homepage contains the daily challenge, where users can indicate that they finished the challenge, or refresh to receive a new challenge, if they don't like their old one or finished and want another one. 

The home page contains a navbar as well, that contains links: back to the home page, to the friend activity page, to the history page, and to signout. In addition, it has metrics for Stars and Streaks. 

Stars indicate the total amount of work you have done. Currently each challenge is relatively easy, so each challenge is 1 star. In the future when we begin to add increasingly difficult challenges, they will be worth more. The Streaks refer to how many days in a row you have completed a challenge. 

The Friend Activity Page allows users to send friend requests to others through their email and keep track of their friends' progress by showing their friends' total stars as well as their daily challenges complete. 

The History page is simply a page where the user can see all of the challenges they've complete since they started. 