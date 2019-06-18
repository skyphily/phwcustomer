// import '@babel/polyfill';
import 'bootstrap';
var $ = require('jquery');

import '../scss/custom.scss';

import firebase from 'firebase/app';
import 'firebase/firestore';

import {
  mapTableData,
  generateTable,
  filterTableData,
  generateTBody,
  sortTableData
} from './table';

{
  var firebaseConfig = {
    apiKey: 'AIzaSyBb8iIBihoN3aLstT5Pe5s3q0AevYxuNRw',
    databaseURL: 'https://phwcustomer.firebaseio.com',
    projectId: 'phwcustomer',
    appId: '1:374797303776:web:929bf7d114a73ba5'
  };
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
    console.log(customers);
    customers.forEach(doc => {
      // console.log(`${doc.id} => ${doc.data()}`);
      // const customer = doc.data();
      customerTableData.push(mapTableData(doc.id, doc.data()));
    });
    return customerTableData;
  };

  /**
   * render table to display content
   */
  app.renderTable = (dataArray, initial) => {
    const tableDiv = document.querySelector('#customerTable');

    if (initial) {
      const table = generateTable(dataArray);
      tableDiv.innerHTML = table;
      //add sort event ;
      const thArr = tableDiv.querySelectorAll('th');
      thArr.forEach(th => th.addEventListener('click', app.sort));
    } else {
      const tbody = tableDiv.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = generateTBody(dataArray);
      }
    }
     $('[data-toggle="tooltip"]').tooltip({
       'placement': 'left',
      'template':'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'});
  };

  /**
   * filter action
   */
  app.filter = e => {
    const filterText = e.target.value;
    if (filterText && filterText.length > 0) {
      const newTableData = filterTableData(app.tableData, filterText);
      //if (newTableData.length != app.tableData.length) {
      //re-render the table data
      sortTableData(newTableData, app.sortParam);
      app.renderTable(newTableData);
      //}
    } else {
      //re render when length is 0
      sortTableData(app.tableData, app.sortParam);
      app.renderTable(app.tableData);
    }
  };

  /**
   * sort function
   */
  app.sort = evt => {
    let th = evt.target;
    if (th.tagName != 'TH') {
      th = th.parentNode;
    }
    const iconList = th.parentNode.querySelectorAll('th i');
    for (let icon of iconList) {
      if (icon.parentNode == th) {
        // to process the pressed TH
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

  app.changeIcon = (icon, oldIconName, newIconName) => {
    const getIconName = name => 'fa-sort' + (name.length > 0 ? '-' + name : '');
    icon.classList.replace(getIconName(oldIconName), getIconName(newIconName));
  };

  app.setDetail = target => {
    if (app.tableData) {
      const customer = app.tableData.find(item => item.id === target.id);
      if (customer) {
        document.querySelector('#dtCustomerId').value = customer['id'];
        document.querySelector('#dtName').value = customer['name'];
        document.querySelector('#dtPhone').value = customer['contact.phone'];
        document.querySelector('#dtEmail').value = customer['contact.email'];
        document.querySelector('#dtCreationDate').value = customer['createDate'];
        document.querySelector('#dtStatus').value = customer['status'];
      }
    }
  };
  /**
   * submit change to firebase
   */
  app.submitChange = async evt => {
    const status = document.querySelector('#dtStatus').value;
    const id = document.querySelector('#dtCustomerId').value;

    if (id) {
      try {
        await db
          .collection('customers')
          .doc(id)
          .set({ status: status }, { merge: true });

        app.updateDisplayTable({ id: id, status: status });
      } catch (err) {
        console.log(err);
      }
    }

    console.log('here', status);
  };
  app.updateDisplayTable = newCustomer => {
    if (app.tableData) {
      const customer = app.tableData.find(item => item.id === newCustomer.id);
      if (customer) {
        customer.status = newCustomer.status;
        //filter table data if filter string exists
        const filter = document.querySelector('#iFilter');
        let data = app.tableData;
        if (filter.value.length > 0) {
          data = filterTableData(app.tableData, filter.value);
        }
        sortTableData(data, app.sortParam);
        // re-render table
        app.renderTable(data);
      }
    }
  };
  app.init = async () => {
    app.tableData = await app.loadCustomers();
    app.renderTable(app.tableData, true);
    app.setEvent();
  };
  /**
   * set events;
   */

  app.setEvent = () => {
    const inputFilter = document.querySelector('#iFilter');
    //set input method
    inputFilter.oninput = app.filter;

    $('#detailModal').on('show.bs.modal', evt => app.setDetail(evt.relatedTarget));

    const btnSubmit = document.querySelector('#bSubmit');
    btnSubmit.onclick = app.submitChange;
    $('[data-toggle="tooltip"]').on('show.bs.tooltip', function (evt) {
     
     console.log('here',evt.target);
    });
  };

  // initial the app, main entry of app.
  app.init();
}
