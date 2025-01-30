NOTE: I was unsure whether or not the README had to be in English or not, just in case I am writing in English.

Github Links (NOTE 2: Due to the nature of Render I uploaded them as seperate repositories):

https://github.com/merisir573/final-auth 

https://github.com/merisir573/final-doctor

https://github.com/merisir573/final-gateway 

https://github.com/merisir573/final-medicine (current one)

https://github.com/merisir573/final-pharmacy

https://github.com/merisir573/final-frontend

Deployed Links (NOTE 3: Due to the nature of the Free Tier on Render, the longer a service remains deployed the slower it becomes, as such trying to use the services may result in a 1-2 minute delay, rest assured the system is working it is just taking a while.)

https://finals-frontend-tc7g.onrender.com/ (NOTE 4: You will have to click on one of the pages on the top left.)

https://finals-auth.onrender.com

https://finals-doctor.onrender.com

https://finals-gateway.onrender.com

https://finals-medicine.onrender.com

https://finals-pharmacy.onrender.com

Video Link:

https://youtu.be/cOBk9qv27sI (NOTE 5: The video is send only, if it doesn't work, please send an E-Mail so I can change it to public)

---My Design---
For the most part the designs are pretty straightforward.

Gateway: Checks the route and redirects accordingly.

Doctor: Takes the presented data and queues it using RabbitMQ. Requires authentication which is passed through the header with the key "Authentication" (NOTE: I accidentally say Authorization in the video) and the value "Bearer [ACCESSKEY]"

Pharmacy: Takes the presented data, checks to see if any message in the queue matches it and if so, removes from the queue. Requires authentication which is passed through the header with the key "Authentication" and the value "Bearer [ACCESSKEY]"

Medicine: On initialization scrapes the topmost excel found in https://www.titck.gov.tr/dinamikmodul/43 and saves the name and status of the rows into MongoDB, a NoSQL database, which is then searched whenever a query is passed in. It also has pagination with each page showing 10 medication. The database gets updated every Sunday at 22:00 using a Cron Job defined in Github, it is viewable in the actions section of this repo.

Auth: Uses JWT, the strategy it uses is to get "Bearer" +  [ACCESSKEY] which is generated upon a successful login. Keeps a repo of users which get registered upon a successful register. Uses username and password as its two values.

Frontend: Uses Tailwind for the CSS and Vite for the site. Uses textboxes for data which is jsonified and then upon a button press directs that data using via the gateway. Upon a successful login the access key is kept so as to be passed into the gateway's header whenever needed.

---Assumptions Made---

One assumption and design choice I made was to depricate the need for a prescription service, instead spreading it into doctor and pharmacy, from what I can tell this does not cause any issues as both are connected to the same RabbitMQ server.

---Issues I Encountered---

The biggest issue I encountered was the difficulty of deploying to Render, I had to change the way my gateway was coded in order to fix the issue. Another issue was that the authentication header was not being passed correctly, I did have a way to fix this but said fix became unnecessary when I switched over to the new gateway system.

Aside from that I do not know how to implement mock APIs or notifications and as such I could not implement them.
