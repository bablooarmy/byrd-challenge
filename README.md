# byrd-challenge
Front end development challenge for Byrd

# Workflow / User Journey

On load, the user is presented with a form, which includes:(status: Implemented)

A customer selector (list retrieved from API) (status: Implemented)

A date range (start and end date) (status: Implemented)

After submitting the form, the orders are retrieved from the API (status: Implemented)

The page then displays the following: (status: Implemented)

A list of all the orders (status: Implemented)

The recipient name and email address (status: Implemented)

The total price of the order (based on the total_price from each item) (status: Implemented)

When the order was made (status: Implemented)

The items within the order (status: Implemented)

The delivery details (status: Implemented)

A summary at the top of the page (status: Implemented)

The date range and the total number of days (status: Implemented)

The total amount to invoice (based on the charge_customer value) (status: Implemented)

The number of orders (status: Implemented)

# API
The API is documented and hosted on Apiary (status:used mocked data while developing and for production build real API url will be consumed while generating PROD build environment.ts will be overwritten by environment.prod.ts)

# BONUS: State persistence
Devise a way of storing the current state of the app, such that the user is able to refresh the page, and when the app reloads the previous state is displayed (i.e. including the state of the form and the orders retrieved)(status: Implemented)
