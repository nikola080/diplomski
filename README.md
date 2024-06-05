This project is made for semi-small tennis clubs and is written using MEAN stack techonolgy.
There are 5 types of users : 
  1. Guest - this user as the name states has only limited access to a website with following functionalities : looking up a state of a currently played tournament, looking up rank list of players within the club and looking up a galarey with basic information
     about the club and signing up as some type of user after which he needs to wait for admin to accept him as a user.
  2. Recreational player - this user can reserve a session on any of the available courts, register for fresh tournament and have overview of his session reservations and cancel them is he has to.
  3. Academy player - this user can overview practise sessions made by a coach for them and cancel them if he has to, and has all functionalities as recreational player.
  4. Coach - this user can make a coaching session for his academy players and then after make a note about the session and store it in his web diary.
  5. Admin - this user can almost modify any state of data, he also decides who can become any of 3 above users from guests who previously made an attempt to sign up. Has interactive interface of modifying tournament matches whrere he just click on any match
     and form for modifying opens bellow the frame of a tournament.

Tournament display is made using canvas tag and is drawn same as any tennis tournament looks like, like a binary tree rotated 90 degrees clockwise. Admin can click on any of match field and in eventlistener method it is calculated on which one he clicked
based on x and y coorindate, and after than form for modifying state of the match is opened bellow. After modifying any user that wants to look up that tournament can se updated state of tour.
