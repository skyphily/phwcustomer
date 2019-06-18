# Propellerhead Customer program

This project is for Propellerhead customer website. This is a Single Page Application which will show

## Implemented function list:
1. Able to read customers from backend database and display as a table.
2. Able to filter the table record when type text in filter input box. When any field in a row matches the filter text, the row will be displayed; otherwise the row will be hidden.
3. Able to view customer detail information along with existing notes in a modal dialog.
4. Able to update customer status from a dropdown list, after submit, database record and the customer table will be updated with the new status. 
5. Able to add notes to each customer. 

## file structure 
src/
... app.html : single html page for displaying customer table and detail
... app.js : main program to support the logic of customers
... table.js: program of handling table related processing

## technology used
### Frontend
* Javascript ES6 : program language.
* Bootstrap : used as framework and layout.
* SCSS: define css style.
* Webpack: convert, pack pages into bundle for release.

### Backend
* Firebase firestore : no-sql database to store the customer data
* Firebase hosting : web hosting for the application

### Others
* ESlint: Grammar checking and formatting 
* Git : Version management
* dayjs: Format date for creating date
* lodash.get :get value from complicated key. 

## Function did not implemented

* Signin and security function 
* Error handling and message
* UI beautifying and theme design

