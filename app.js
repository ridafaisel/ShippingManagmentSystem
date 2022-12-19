const querys = require('./querys');
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const { update } = require('tar');
const app = express();
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static('./public'));
app.set('view engine' , 'ejs')








///
app.get('/', async (req,res)=>{

    res.render('login');

        
    
    
});

///
app.post('/', urlencodedParser,async (req,res)=>{

    if(req.body == undefined){
        console.log(req.body);
        res.render('index',{packages: []});
}
    else{
        package = await querys.getLast_state(req.body.package_ID);
        console.log(package+"***" +req.body.package_ID);
        res.render('index',{packages: package})
    }
    
});


///
app.get('/login',(req,res)=>{
    res.render('login')
})


///
app.post('/login',urlencodedParser,async (req,res)=>{
   

   let user =  await querys.getUser(req.body.username,req.body.password);

   if(user == [])
   res.render('login');

   else{
    if(user[0].Type == 'admin')
    res.render('admin')
    else
    res.render('customer')
   }
})
//////////////
//////////////
app.get('/customers-mod', async (req,res)=>{

    let customers = await querys.getAllCustomers();
    console.log(customers);
    
res.render('customers-mod', {customers:customers});
});

app.post('/modify-cust' , urlencodedParser, async (req,res)=>{
    
    console.log(req.body.ID);

   let cust = await querys.getCustomer(req.body.ID);

   if (cust[0].City != req.body.city)
    querys.udateCustomer(req.body.ID,"City" , `${req.body.city}`)
    if (cust[0].Fname != req.body.Fname)
    querys.udateCustomer(req.body.ID,"Fname" , `${req.body.Fname}`)

    if (cust[0].Lname != req.body.Lname)
    querys.udateCustomer(req.body.ID,"Lname" , `${req.body.Lname}`)

    if (cust[0].Phone_number != req.body.Phone_number)
    querys.udateCustomer(req.body.ID,"Phone_number" , `${req.bodyPhone_number}`)

    if (cust[0].Email != req.body.Email)
    querys.udateCustomer(req.body.ID,"Email" , `${req.body.Email}`)

    if (cust[0].DateOf_Birth != req.body.DateOf_Birth)
    querys.udateCustomer(req.body.ID,"DateOf_Birth" , `${req.body.DateOf_Birth}`)

    let customers = await querys.getAllCustomers();
    console.log(customers);
    
res.render('customers-mod', {customers:customers});
});

app.post('/add-cust', urlencodedParser , async (req,res)=>{

    querys.addCustomer(req.body.city,req.body.Fname,req.body.Lname,req.body.Phone_number,req.body.Email,req.body.DateOf_Birth);
    

    let customers = await querys.getAllCustomers();
    
res.render('customers-mod', {customers:customers});

});


app.get('/user-mod', async (req,res)=>{

    let users = await querys.getAllUsers();

    res.render('user-mod', {users: users});
});


app.post('/mod-user-form', urlencodedParser , async (req,res)=>{

    if(req.body.action == 'modify'){
        let user = await querys.getUser(req.body.Username,req.body.Password);

        if(user[0].Type != req.body.Type)
        querys.updateUser(req.body.Username , 'Type' , req.body.Type);
    
        if(user[0].Customer_ID != req.body.Customer_ID)
        querys.updateUser(req.body.Username , 'Customer_ID' , req.body.Customer_ID)
    
        let users = await querys.getAllUsers();
    
        res.render('user-mod', {users: users});
    }

    else if(req.body.action == 'Remove') {
        
        querys.removeUser(req.body.Username)

        let users = await querys.getAllUsers();
    
        res.render('user-mod', {users: users});
    }

    else{
        console.log("invalid action");
        let users = await querys.getAllUsers();
    
        res.render('user-mod', {users: users});
    }

    

});

app.post('/add-user',urlencodedParser , async (req,res)=>{


    querys.addUser(req.body.Username,req.body.Password);

    let users = await querys.getAllUsers();


    res.render('user-mod', {users: users});
});


app.get('/packages-mod',async (req,res)=>{
    let packages = await querys.getAllPackages();

    res.render('packages-mod', {packages:packages});
})

app.post('/modify-pack',urlencodedParser,async (req,res)=>{

    if(req.body.action == 'remove'){
        console.log(req.body.ID);
        querys.removePackage(req.body.ID);
        let packages = await querys.getAllPackages();

    res.render('packages-mod', {packages:packages});
        
        
    }

    else if(req.body.action == 'modify'){
        let package = await querys.getPackage(req.body.ID);
        let ID = req.body.ID;

        console.log(package);

        if(req.body.Destination != package.Destination){
            querys.udatePackage(ID,'Destination', req.body.Destination)
        }
         if(req.body.Category != package.Category){
            querys.udatePackage(ID,'Category', req.body.Category)
        }
        if(req.body.Payment != package.Payment){
            querys.udatePackage(ID,'Payment', req.body.Payment)
        }
        if(req.body.Status != package.Status){
            querys.udatePackage(ID,'Status', req.body.Status)
        }
        if(req.body.Reciver_ID != package.Reciver_ID){
            querys.udatePackage(ID,'Reciver_ID', req.body.Reciver_ID)
        }
    
        let packages = await querys.getAllPackages();

        res.render('packages-mod', {packages:packages});
    
    }

    else if (req.body.action == 'add'){
        console.log(req.body.Category);
        querys.addPackage(req.body.Weight,req.body.Length , req.body.Width , req.body.height , req.body.Final_Delivery_Date , req.body.Destination , req.body.Category,req.body.Customer_ID,req.body.Center_ID, req.body.Reciver_ID,req.body.Package_ID);
    
        let packages = await querys.getAllPackages();

        res.render('packages-mod', {packages:packages});
    }

    else if (req.body.action == 'send'){
        console.log(req.body.Category);
        querys.addPackage(req.body.Weight,req.body.Length , req.body.Width , req.body.height , req.body.Final_Delivery_Date , req.body.Destination , req.body.Category,req.body.Customer_ID,req.body.Center_ID, req.body.Reciver_ID,req.body.Package_ID);
    
        res.render('customer');
    }

})
///////
app.post('modify-own-pack',async (req,res)=>{

    querys.addPackage(req.body.Weight,req.body.Length , req.body.Width , req.body.height , req.body.Final_Delivery_Date , req.body.Destination , req.body.Category,req.body.Customer_ID,req.body.Center_ID, req.body.Reciver_ID,req.body.Package_ID);

    let packages = await querys.getAllPackages();

    res.render('customer', {packages:packages});
})

///

app.post('/see-packages' ,urlencodedParser ,async (req,res)=>{

    let packages = await querys.getPackageByCID( req.body.id);
    res.render('customer-packages', {packages:packages});
});

app.get('/paid',async(req,res)=>{
let paid = await querys.getPaidShipments();

res.render('paid-shipments', {packages:paid})
});
///
app.get('/reports',(req,res)=>{
    
    res.render('reports')
})
///
app.get('/package-st-dt', (req,res)=>{
    res.render('status-date')
});
///

app.post('/st-dt-search', urlencodedParser ,async (req,res)=>{
    
    packages = await querys.getPackagesSateus_date(req.body.date1, req.body.date2,req.body.status);
    console.log(packages);
    res.render('track-st-dt', {packages:packages});
});
///

app.post('/package-tp-dt',urlencodedParser,async (req,res)=>{

   let packages = await querys.getPackagesByTypeAndDate(req.body.type, req.body.date1,req.body.date2);

// let package_t_D =await querys.getPackagesByTypeAndDate('Fragile','2022-01-07','2022-04-08');
// console.log(package_t_D);

   res.render('package-report' ,{ packages:packages} );
})
////
app.get('/package-tp-dt',(req,res)=>{
    res.render('packages-type-date');
});
///


app.get('/package-ct-loc-st',async (req,res)=>{
  
    res.render('package-loc-type-stat')

});
////


////
app.post('/package-ct-loc-st',urlencodedParser , async (req,res)=>{

    let packages = await querys.getPackagesByLoc_cat_sat(req.body.loc,req.body.type,req.body.status);

    res.render('package-report', {packages:packages})
}) 
////


app.get('/package-send-rec',(req,res)=>{

    res.render('sender-reciver');
});
///

app.post('/package-send-rec',urlencodedParser,async (req,res)=>{

    let packages = await querys.ListAllPackagesBySenderOrReciver(req.body.ID);

    res.render('package-report', {packages:packages})
})

///

app.get('/not' ,(req,res)=>{
    res.render('not-imp')
})

///


app.post('/customer-opt', urlencodedParser, async (req,res)=>{
    
    if(req.body.action == 'pay'){
        querys.pay(req.body.ID)

        let packages = await querys.getPackageByCID( req.body.Customer_ID);
        res.render('customer-packages', {packages:packages});
         }

         if(req.body.action == 'trace'){
            let Tracks = await querys.trace(req.body.ID);
         
            res.render('trace', {Tracks: Tracks})
         }
})


app.get('/trace', (req,res)=>{
    res.render('admin-trace')
} )


app.listen(4000,()=>{
    console.log('app is listing on port 4000');
})