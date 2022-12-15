const { get } = require('cacache');
const { log, count } = require('console');
const { stat } = require('fs');
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

  sql=``
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
  sql = `INSERT INTO packages (weight,length , width, height ,Send_Date,Destination,Category,Customer_ID,Reciver_ID ,Center_ID,Package_ID,Payment) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`

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




// add Tracing information 

function addTrack (status, Year, day, month ,Package_ID,Location_ID ){
  sql = `INSERT INTO Track (status, Year, day, month ,Package_ID,Location_ID) VALUES(?,?,?,?,?,?)`

  db.run(sql,[status, Year, day, month ,Package_ID,Location_ID],(err)=>{
   
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

  db.run(sql,['user', Username, Password ,''],(err)=>{
   
     if(err){
         return console.log(' the username is already taken');
     }

     else return console.log('The account is set successfully !');

  });
}
// end of add user

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

//remove package. 
function removePackage (Package_ID){
  sql = `DELETE FROM Packages WHERE Package_ID = ${Package_ID}?`

  db.all(sql,[],(err=>{
    if(err)
    return console.log(err.message);

    else {
      rows.forEach(row=>{
        console.log(row)
      })  
      return console.log('the record was deleted')
    }
  }));
}
// end of remove package.

// update package
function udatePackage (Package_ID , column,value){
  sql = `UPDATE Packages
  SET ${column} = "${value}"
  WHERE Package_ID = ?;`

  db.all(sql,[Package_ID],(err=>{
    if(err)
    return console.log(err.message);

    else
  
    return console.log('the record was updated')
    
  }));
}
// end of update package. 


// tracing a package 
 function trace(Package_ID){

  return new Promise((resolve,reject)=>{
    sql = `SELECT * FROM Packages WHERE Package_ID = ?`
  
    db.all(sql,[Package_ID],async (err,rows)=>{
    
     if(err){
         return reject(err.message); }
         if(rows.length==0)
         console.log('no such package');

        let state = await getLast_state(Package_ID)
       resolve([rows,state])
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
  maxYear = `
  CREATE VIEW maxYear AS
  SELECT *
  FROM Track
  WHERE year = (SELECT max(year) FROM Track) AND Package_ID = ${package_ID}
`
maxMonth = `
CREATE VIEW maxMonth AS
SELECT *
FROM maxYear
WHERE month = (SELECT max(month) FROM maxYear) `

maxDay= `SELECT *
FROM maxMonth
WHERE day = (SELECT max(day) FROM maxMonth)`

db.all(maxDay,[],(err,rows)=>{
  if(err)
  reject(err.message);

  rows.forEach(row=>{
    if(`${row.status}`.trim() == ' Delivered'.trim()){
      console.log(row);
      resolve(row)
    }
    })
    resolve(rows)
});
})
}
// end of getting the state of a package


// getting the packages between 2 dates 
function getPackagesSateus(){

All_states= `SELECT *
FROM ( SELECT *
FROM ( SELECT *
FROM Track
WHERE year = (SELECT max(year) FROM Track)
)
WHERE month = (SELECT max(month) FROM Track))
WHERE day = (SELECT max(day) FROM Track)`


  return new Promise((resolve,reject)=>{
   
    db.all(All_states,[],(err,rows)=>{
   
      if(err){
           reject(err.message);
      }
      
       resolve(rows);
       
      })
  });
  
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

function getPaidShipments(){

  sql =`SELECT * FROM packages WHERE Payment = "paid" `
  return new Promise((resolve,reject)=>{
  db.all(sql,[],(err,rows)=>{
    if(err){ reject(err.message) }
    
    resolve(rows);
  })
})
}

function getPackagesByTypeAndDate (type,date1,date2){
  sql = `SELECT * FROM Packages  WHERE Category = "${type}" AND Final_Delivery_Date BETWEEN "${date1}" AND "${date2}"`

  let count =`SELECT COUNT (*) FROM (${sql}) `
  return new Promise((resolve,reject)=>{
    db.all(count,[],(err,rows)=>{
      if(err){reject(err.message)}
      else resolve(rows)
    })
  })

}

//end of get packages by type and date

// get the packages between by category location and status.
function getPackagesByLoc_cat_sat(location_ID,category,status){



sql = `SELECT * FROM Packages JOIN Status on packages.package_ID = Status.package_ID WHERE Location_ID = '${location_ID}' AND Category = '${category}' AND Status.status = '${status}'`

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
// addTrack ("Delivered",2022,1,9,2,3);
// let state = await getLast_state(1).catch(err=>{console.log(err);});

// let allStates = await getPackagesSateus();
// console.log(allStates);

// paid = await getPaidShipments()
// console.log(paid);

// package_t_D =await getPackagesByTypeAndDate('Fragile','2022-01-07','2022-01-08');
// console.log(package_t_D);

// let temp = await getPackagesByLoc_cat_sat(2,"Fragile",' in transit');
// console.log(temp);

// let s_r   = await ListAllPackagesBySenderOrReciver(1)

// console.log(s_r);


// addEmployee("Ahmad" , "Jeddah");

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
  getPackagesSateus:getPackagesSateus,
  pay:pay,
  getPaidShipments:getPaidShipments,
  getPackagesByTypeAndDate:getPackagesByTypeAndDate,
  getPackagesByLoc_cat_sat:getPackagesByLoc_cat_sat,
  ListAllPackagesBySenderOrReciver:ListAllPackagesBySenderOrReciver

}