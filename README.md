# educatly-challenge

Welcome to tracking the working hours!

First, run json-server using the following command:
json-server --watch workingDays.json

Second, run the frontend using:
npm start

And voila, here is the easiet application to track your working hours!

# Interacting with the webpage

    - The table displayed is only for one employee showing his working hours history
    - The day is added automatically to the table, unless it's Friday or Saturday (assuming they are the official holidays).
    - You should add the arriving time,lunch time and exit time by entering the time and pressing on Enter.
    - You cannot edit the time after entering it.
    - It will calculate the working hours per day and display the state of your worked hours, whether above or below the expected working hours.
