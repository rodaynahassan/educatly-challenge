# educatly-challenge

Welcome to tracking the working hours!
First, cd working-hours
First, run json-server using the following command:
json-server --watch workingDays.json

Second, run the frontend using:
npm start

And voila, here is the easiet application to track your working hours!

# Material UI

Material UI was used in this project in order to build a scalable, interactive design with vibrant colors and visual props. It was the only UI library used to avoid using multiple libraries and put extra load on the project.

# Interacting with the webpage

    - The table displayed is only for one employee showing his working hours history
    - The day is added automatically to the table, unless it's Friday or Saturday (assuming they are the official holidays).
    - The employee should fulfill 8 working hours per day.
    - You should add the arriving time first to be able to enter the lunch break and exit time.
    - The arrived time should be between 8 AM and 6 PM
    - The lunch break and exit time should be greater than the arrived time and also between 8 AM and 6 PM.
    - You cannot edit the time after entering it.
    - Once the arrived and exit time are entered, the working hours per that day along with the status (Above or below) will be displayed.
    - If the day passed without adding the arrived or exit time, the record for this day won’t be displayed and it will be removed from the table. This is to encourage the employees to add the data consistently; day by day.

# Extra feature

    - It will also calculate the working hours in the last 7 days.
        Example: If we are on Tuesday, the working hours from last Tuesday to Monday will be displayed.
