// import '@babel/polyfill';
import 'bootstrap';
import '../scss/custom.scss';

import firebase from 'firebase/app';
import 'firebase/firestore';

import {
  mapTableData,
  generateTable,
  filterTableData,
  generateTBody,
  sortTableData,
  CUSTOMER_FILEDS
} from './table';

var $ = require('jquery');

{
  //firebase config file
  var firebaseConfig = {
    apiKey: 'AIzaSyBb8iIBihoN3aLstT5Pe5s3q0AevYxuNRw',
    databaseURL: 'https://phwcustomer.firebaseio.com',
    projectId: 'phwcustomer',
    appId: '1:374797303776:web:929bf7d114a73ba5'
  };
  //initial firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  /*
    app: global vairable of app page
    */
  const app = {
    tableData: [],
    sortParam: {
      field: '',
      desc: false
    }
  };

  /**
   * load customers from database
   */
  app.loadCustomers = async () => {
    const customerTableData = [];
    const customers = await db.collection('customers').get();
    //generate display data
    customers.forEach(doc => {
      customerTableData.push(mapTableData(doc.id, doc.data()));
    });
    return customerTableData;
  };

  /**
   * render table to display content
   */
  app.renderTable = (dataArray, initial) => {
    const tableDiv = document.querySelector('#customerTable');

    if (initial) { //generate table header only on first time render
      const table = generateTable(dataArray);
      tableDiv.innerHTML = table;
      //add sort event ;
      const thArr = tableDiv.querySelectorAll('th');
      thArr.forEach(th => (th.innerHTML !== '' ? th.addEventListener('click', app.sort) : ''));
    } else {
      //generate table body, can be called multiple tiles.
      const tbody = tableDiv.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = generateTBody(dataArray);
      }
    }
    //add tool tips
    $('[data-toggle="tooltip"]').tooltip({
      placement: 'left',
      template:
        '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
    });
  };

  /**
   * filter action
   */
  app.filter = e => {
    //get filter text
    const filterText = e.target.value;
    if (filterText && filterText.length > 0) {
      const newTableData = filterTableData(app.tableData, filterText);
      //re-render the table data
      sortTableData(newTableData, app.sortParam);
      app.renderTable(newTableData);
    } else {
      //re render when length is back to 0
      sortTableData(app.tableData, app.sortParam);
      app.renderTable(app.tableData);
    }
  };

  /**
   * sort function
   */
  app.sort = evt => {
    let th = evt.target;
    //make sure get the th element
    if (th.tagName != 'TH') {
      th = th.parentNode;
    }
    //display correct icons in all th.
    const iconList = th.parentNode.querySelectorAll('th i');
    for (let icon of iconList) {
      if (icon.parentNode == th) {
        // to process the pressed TH
        //remove the first 3 chars 'th_' and compare
        if (th.id.slice(3) == app.sortParam.field) {
          //process the same field that just pressed last time
          app.sortParam.desc
            ? app.changeIcon(icon, 'down', 'up')
            : app.changeIcon(icon, 'up', 'down');
          app.sortParam.desc = !app.sortParam.desc;
        } else {
          // process a new field different with the field is pressed.
          app.sortParam.desc = false;
          // icon.classList.replace('fa-sort','fa-sort-up');
          app.changeIcon(icon, '', 'up');
        }
        //save the field name after remove the first 3 chars 'th_'
        app.sortParam.field = th.id.slice(3);
      } else {
        // to process other TH

        app.changeIcon(icon, 'up', '');
        app.changeIcon(icon, 'down', '');
      }
    }
    //filter table data if filter string exists
    const filter = document.querySelector('#iFilter');
    let data = app.tableData;
    if (filter.value.length > 0) {
      data = filterTableData(app.tableData, filter.value);
    }

    // do sort data
    sortTableData(data, app.sortParam);
    // re-render table
    app.renderTable(data);
  };

  /**
   * show with correct FA icons
   */
  app.changeIcon = (icon, oldIconName, newIconName) => {
    const getIconName = name => 'fa-sort' + (name.length > 0 ? '-' + name : '');
    icon.classList.replace(getIconName(oldIconName), getIconName(newIconName));
  };

  /**
   * set customer detail in modal dialog
   */
  app.setDetail = target => {
    if (app.tableData) {
      //get customer by customer ID dfined in table row
      const customer = app.tableData.find(item => item.id === target.id);
      if (customer) {
        //set values 
        document.querySelector('#dtCustomerId').value = customer['id'];
        CUSTOMER_FILEDS.map(field =>{
          document.querySelector(`#${field.DETAIL_FIELD_NAME}`).value = customer[field.FIELD_NAME];
        });
        
      }
    }
  };
  /**
   * submit change to firebase
   */
  app.submitChange = async evt => {
    const status = document.querySelector('#dtStatus').value;
    const note = document.querySelector('#dtNote').value;
    const id = document.querySelector('#dtCustomerId').value;
    if (id) {
      //set update json data
      const updateData = { status: status, note: note };
      // do update
      try {
        await db
          .collection('customers')
          .doc(id)
          .set(updateData, { merge: true });
        //update display table
        app.updateDisplayTable({ id: id, ...updateData });
      } catch (err) {
        console.log(err);
      }
    }
  };

  /**
   * update display table.
   */
  app.updateDisplayTable = newCustomer => {
    if (app.tableData) {
      //find the customer in table data
      const customer = app.tableData.find(item => item.id === newCustomer.id);
      if (customer) {
        //update corresponding fields.
        customer.status = newCustomer.status;
        customer.note = newCustomer.note;
        //filter table data if filter string exists
        const filter = document.querySelector('#iFilter');
        let data = app.tableData;
        if (filter.value.length > 0) {
          data = filterTableData(app.tableData, filter.value);
        }
        //sort table with current sort setting
        sortTableData(data, app.sortParam);
        // re-render table
        app.renderTable(data);
      }
    }
  };
  /**
   * init app page
   */
  app.init = async () => {
    //load customers from DB and set to app.tableData
    app.tableData = await app.loadCustomers();
    // intial render table
    app.renderTable(app.tableData, true);
    //set events
    app.setEvent();
  };
  /**
   * set events;
   */

  app.setEvent = () => {
    const inputFilter = document.querySelector('#iFilter');
    //set input method
    inputFilter.oninput = app.filter;
    //set modal dialog submit method
    const btnSubmit = document.querySelector('#bSubmit');
    btnSubmit.onclick = app.submitChange;
    //set customer detail when show modial dialog
    $('#detailModal').on('show.bs.modal', evt => app.setDetail(evt.relatedTarget));
  };

  // initial the app, main entry of app.
  app.init();
}
