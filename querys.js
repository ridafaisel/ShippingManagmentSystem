const { reject } = require('async');
const { get } = require('cacache');
const { log, count } = require('console');
const { stat, lstat } = require('fs');
const { maxHeaderSize } = require('http');
const { resolve } = require('path');
const { list } = require('tar');
const { hasAnOpaquePath } = require('whatwg-url');

sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('shipment.db', sqlite3.OPEN_READWRITNE, (err) => {
    if (err) {
      return console.error( 'here');
    }
    console.log('Connected to the shipments database.');
  });
sql =''
  // sql= `SELECT * FROM Last_Status`

  db.all(sql,[],(err,rows)=>{
   
     if(err){
         return console.log(err.message);
     }

     console.log(rows);
  });









  //-----------functions--------------------functions------------------functions--------------------------functions----------------functions---------------functions-------------------------------------------------


  // ADD CENTER; 

function addCenter(Type,Address){
    sql = `INSERT INTO Center(Type , Address)4
     VALUES(?,?)`

  db.run(sql,[Type,Address],(err)=>{
   
     if(err){
         return console.log(err.message);
     }
     else(
        console.log('The center is added sucsessfully !')
     )
  });
}
// End of Add Center


// add a customer..
function addCustomer(City, Fname, Lname, Phone_number,Email,DateOf_Birth){

   sql = `INSERT INTO Customer(City, Fname, Lname, Phone_number,Email,DateOf_Birth) VALUES(?,?,?,?,?,?)`

  db.run(sql,[City, Fname, Lname, Phone_number,Email,DateOf_Birth],(err)=>{
   
     if(err){
         return console.log(err.message);
     }
     else(
        console.log('The Customer is added sucsessfully !')
     ) 
  });
}
// End of Add Customer..

// Get customer 
function getCustomer(id){
  sql = `Select * FROM CUSTOMER WHERE Customer_ID = ${id}`
  return new Promise((resolve,reject)=>{
    db.all(sql, [] , (err,rows)=>{
      if(err)
      reject(err.message)

      resolve(rows)
    });
  });
}
// end of get customer

// get all customers.

function getAllCustomers() {

  sql= `SELECT * FROM Customer`

  return new Promise((resolve , reject)=>{

    db.all(sql,[],(err,rows)=>{
      if(err)
      reject(err.message);

      console.log(rows);
      resolve(rows)
    });

  });

}


// add Employee

function addEmployee(Name,City){
  sql = `INSERT INTO Employee (Name, City) VALUES(?,?)`

  db.run(sql,[Name,City],(err)=>{
   
     if(err){
         return console.log(err.message);
     }
     else(
        console.log('The Employee is added sucsessfully !')
     )

 
  });
}
//End of add Employee 

//Edit Employee 

function EditEmployee(Emp_ID,column,value){
   sql = `UPDATE Packages
  SET ${column} = "${value}"
  WHERE Emp_ID = ${Emp_ID};`

  db.run(sql,[],err=>{
    if(err)
    console.log(err);
    console.log("the employee has been updated !");
  });
}
// end of edit Employee


// add location 
function addLocation(Name,Type){
  sql = `INSERT INTO Location (Name, Type) VALUES(?,?)`

  db.run(sql,[Name,Type],(err)=>{
   
     if(err){
         return console.log(err.message);
     }
     else(
        console.log('The Location is added sucsessfully !')
     )
  });
}
// end of add location

// add transportation 

function addTransport(Loc_from, Loc_to , type , Package_ID){

  sql = `INSERT INTO Transportation (Loc_from, Loc_to , type , Package_ID) VALUES(?,?,?,?)`

  db.run(sql,[Loc_from, Loc_to , type , Package_ID],(err)=>{
   
     if(err){
         return console.log(err.message);
     }
     else(
        console.log('The Transport is added sucsessfully !')
     ) 
  });
}
// end of add transportation.


// add package 
function addPackage(weight,length , width, height ,Send_Date,Destination,Category,Customer_ID,Center_ID, Reciver_ID,Package_ID){
  sql = `INSERT INTO packages (weight,length , width, height ,Final_Delivery_Date,Destination,Category,Customer_ID,Reciver_ID ,Center_ID,Package_ID,Payment) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`

  console.log(Category);
  db.run(sql,[weight,length , width, height ,Send_Date,Destination,Category,Customer_ID,Center_ID,Reciver_ID,Package_ID,'NOT paid'],(err)=>{
   
     if(err){
         return console.log(err.message);
     }
     else(
        console.log('The Package is added sucsessfully !')
     )
  });
}
// end of add package

// getAll packages 

function getAllPackages(){

  sql = `SELECT * FROM Packages`
  
  return new Promise((resolve, reject)=>{
     
    db.all(sql ,[] , (err,rows)=>{

        if(err) reject(err);

        resolve(rows)
    })
  })

}

// end of get all packages


// add Tracing information 

function addTrack (status, History ,Package_ID,Location_ID ){
  sql = `INSERT INTO Track (status, History ,Package_ID,Location_ID) VALUES(?,?,?,?)`

  db.run(sql,[status, History,Package_ID,Location_ID],(err)=>{
   
     if(err){
         return console.log(err.message);
     }
     else{

      udatePackage(Package_ID,'status',  status);
        console.log('The Track is added sucsessfully !') }
     
  });
}

// end of add tracing information.


// add user 
function addUser(Username, Password){
  sql = `INSERT INTO User(Type, Username, Password , Customer_ID) VALUES(?,?,?,?)`

  db.run(sql,['User', Username, Password ,''],(err)=>{
   
     if(err){
         return console.log(err.message);
     }

     else return console.log('The account is set successfully !');

  });
}
// end of add user

// getUser
function getUser(username,password){
  sql = `SELECT * FROM User WHERE Username = '${username}' AND Password = '${password}'`

  return new Promise((resolve, reject)=>{
    
    db.all(sql , [], (err,rows)=>{
    
      if(err){
        reject('Error in the query: ' + err.message) }

      resolve(rows)
    
    })

  })
 
}
//end of get user


// getAll users

function getAllUsers(){
  sql = `SELECT * FROM User`

  return new Promise((resolve, reject)=>{
    
    db.all(sql , [], (err,rows)=>{
    
      if(err){
        reject('Error in the query: ' + err.message) }

      resolve(rows)
    
    })

  })
 
}
// end of get all users


//udate user 
function updateUser(username , column , value){
  sql = `UPDATE user
  SET ${column} = "${value}"
  WHERE Username = '${username}';`

  db.all(sql,[],(err=>{
    if(err)
    return console.log(err.message);

    else
  
    return console.log('the user was updated')
    
  }));
}
// end of update users

// Remove user
function removeUser(username) {
  sql = `DELETE FROM User WHERE username = "${username}" `
  db.all(sql,[],(err,rows)=>{
    if(err){console.log(err.message)}
    
    else
    console.log('the user is deleted sucsessfully'); 
  })
} 


// end of remove user

// get package 

function getPackage(package_ID){
  sql = `SELECT * FROM Packages `
  return new Promise((resolve,reject)=>{

    db.all(sql,[] , (err,rows)=>{
      if(err)
      reject(err.message)

      resolve(rows)
    })

  });
   
}

// end of get package

/// get package bt ID
function getPackageByCID(CID){
  sql = `SELECT * FROM Packages WHERE Customer_ID = ${CID} `
  return new Promise((resolve,reject)=>{

    db.all(sql,[] , (err,rows)=>{
      if(err)
      reject(err.message)

      resolve(rows)
    })

  });
}

// end of get package by ID

//remove package. 
function removePackage (Package_ID){
  sql = `DELETE FROM Packages WHERE Package_ID = ${Package_ID}`

  db.all(sql,[],(err,rows)=>{
    if(err)
    return console.log(err.message);

    else {
      rows.forEach(row=>{
        console.log(row)
      })  
      return console.log('the record was deleted')
    }
  });
}
// end of remove package.

// update package
function udatePackage (Package_ID , column,value){
  sql = `UPDATE Packages
  SET ${column} = "${value}"
  WHERE Package_ID = ${Package_ID};`

  db.all(sql,[],(err=>{
    if(err)
    return console.log(err.message);

    else
  
    return console.log('the record was updated')
    
  }));
}
// end of update package. 


//update customer

function udateCustomer (Customer_ID , column,value){
  sql = `UPDATE Customer
  SET ${column} = "${value}"
  WHERE Customer_ID = ${Customer_ID};`

  db.all(sql,[],(err=>{
    if(err)
    return console.log(err.message);

    else
  
    return console.log('the Customer was updated')
    
  }));
}

//end of update customer


// tracing a package 
 function trace(Package_ID){

  return new Promise((resolve,reject)=>{
    sql = `SELECT * FROM track WHERE Package_ID = ${Package_ID}`
  
    db.all(sql,[],async (err,rows)=>{
    
     if(err){
         reject(err.message); }
         console.log('no such package');

       resolve(rows)
       });

  }); 
}
// end of tracing packages.


// getting the email of a customer.
function getEmail(Customer_ID){
  
 
  return new Promise((resolve,reject)=>{
    sql = `SELECT Email FROM Customer WHERE Customer_ID = ${Customer_ID}`
    db.all(sql,[],(err,rows)=>{
   
      if(err){
           reject(err.message);
      }
      console.log(rows);
       resolve(rows[0].Email);
       
      })
  });
}

// end of getting the email of a customer


// getting the state of a package.
function getLast_state(package_ID){
return new Promise((resolve,reject)=>{
 console.log(package_ID);
//   sql = `
//   SELECT *
//   FROM Track
//   WHERE History = (SELECT max(History) ) AND Track WHERE Package_ID = ${package_ID})
// `

sql = `select Package_ID , Status ,max(History)
from Track
group by Package_ID
Having Package_ID = ${package_ID}
`


db.all(sql,[],(err,rows)=>{
  if(err)
  reject(err.message);

    resolve(rows)
});
})
}
// end of getting the state of a package


//
function getStatusCount() {
  sql= `SELECT * FROM Last_Status`

  return new Promise((resolve,reject)=>{
    db.all(sql,[],(err,rows)=>{
    
      if(err){rejerct(err.message)}
      resolve(rows)

    });
  })

 
}
//

// getting the packages between 2 dates 
async function getPackagesSateus_date(date1, date2 , status){

  sql = `select Package_ID , Status ,max(History) as 'max'
  from Track
  group by Package_ID
  Having max(History)  between '${date1}' AND '${date2}' AND status= '${status}'  
  `

  return(new Promise((resolve, reject) => {
    db.all(sql,[],(err,rows)=>{

      if(err) reject(err.message)

      resolve(rows)

    })
  }))

}
// end of getting the packages between 2 dates.


// pay..
function pay(Package_ID){

  sql = `UPDATE Packages
  SET Payment = "paid"
  WHERE Package_ID = "${Package_ID}";`

  db.run(sql,[],(err)=>{
   
     if(err){
         return console.log(err.message);
     }
     else
     console.log('payment sucsessful !');
 
  });
}
// end of pay..



// reports:---------------------------------------------------------

// get pait shipments
function getPaidShipments(){

  sql =`SELECT * FROM packages WHERE Payment = "paid" `
  return new Promise((resolve,reject)=>{
  db.all(sql,[],(err,rows)=>{
    if(err){ reject(err.message) }
    
    resolve(rows);
  })
})
}

// end of get paid shipments




// get packages by Type and date.
function getPackagesByTypeAndDate (type,date1,date2){
  sql = `SELECT * FROM Packages  WHERE Category = "${type}" AND Final_Delivery_Date BETWEEN "${date1}" AND "${date2}"`

  return new Promise((resolve,reject)=>{
    db.all(sql,[],(err,rows)=>{
      if(err){reject(err.message)}
      else resolve(rows)
    })
  })

}

//end of get packages by type and date

// get the packages between by category location and status.
function getPackagesByLoc_cat_sat(location_ID,category,status){

  // sql = `
  // CREATE VIEW Statuss as 
  // select Package_ID , Status ,max(History), location_ID
  // from Track
  // group by Package_ID
  // `

sql = `SELECT * FROM Packages JOIN Statuss on packages.package_ID = Statuss.package_ID WHERE Location_ID = '${location_ID}' AND Category = '${category}' AND Statuss.status = '${status}'`

  return new Promise((resolve,reject)=>{
   
    db.all(sql,[],(err,rows)=>{
   
      if(err){
           reject(err.message);
      }
      
       resolve(rows);
       
      })
  });
  
}


function ListAllPackagesBySenderOrReciver(ID){
  sql = `SELECT * FROM Packages WHERE Customer_ID = ${ID} OR Reciver_ID = ${ID}`
  
  return new Promise((resolve, reject)=>{

    db.all(sql,[],(err,rows)=>{
   
      if(err){
          return reject(err.message);
      }
 
      resolve(rows);
   });

  });
}

//end of function



 


// ---------------------------------------end of functions--------------------------------------------------------



//  --------------------------------------Tests------------------------Tests--------------------------------------

// addCustomer('Dammam', 'Mohannad','Al-gamdi', '05786582142','ridafaiselmockemail8@gmail.com','13/09/1997');

// addTransport(1, 6 , 'Plane' , 1);

// addPackage(1,20,30,50,'02-02-2023','Riyad-south','Fragile',1,2,1);

// addUser('user','user123')

// trace = await trace(2)
// console.log( trace);
 
// removeUser('user');

// udatePackage(1,'Reciver_ID',3);

// console.log(await trace(2));
// console.log( await getEmail(1));
// addTrack ("is transit",'2022-03-19',11,7);
// async function f(){let state = await getLast_state(2).catch(err=>{console.log(err);});
// console.log(state);
// }
// f()

// async function s() {
// let g = await getPackagesSateus_date('2022-02-02', '2022-03-19');
// console.log(g);
// } 

// s()
// paid = await getPaidShipments()
// console.log(paid);



// let temp = await getPackagesByLoc_cat_sat(2,"Fragile",' in transit');
// console.log(temp);

// let s_r   = await ListAllPackagesBySenderOrReciver(1)

// console.log(s_r);


// addEmployee("Ahmad" , "Jeddah");

// getPackagesSateus_date()



module.exports = {
  addCenter:addCenter,
  addCustomer:addCustomer,
  addEmployee:addEmployee,
  addLocation:addLocation,
  addTransport:addTransport,
  addPackage:addPackage,
  addTrack:addTrack,
  addUser:addUser,
  removeUser:removeUser,
  removePackage:removePackage,
  udatePackage:udatePackage,
  trace:trace,
  getEmail:getEmail,
  getLast_state:getLast_state,
  pay:pay,
  getPaidShipments:getPaidShipments,
  getPackagesByTypeAndDate:getPackagesByTypeAndDate,
  getPackagesByLoc_cat_sat:getPackagesByLoc_cat_sat,
  ListAllPackagesBySenderOrReciver:ListAllPackagesBySenderOrReciver,
  getUser:getUser,
  getAllCustomers:getAllCustomers,
  EditEmployee:EditEmployee,
  getCustomer:getCustomer,
  udateCustomer:udateCustomer,
  getAllUsers:getAllUsers,
  updateUser:updateUser,
  getAllPackages:getAllPackages,
  getPackage:getPackage,
  getPackagesSateus_date:getPackagesSateus_date,
  getPackageByCID:getPackageByCID

}