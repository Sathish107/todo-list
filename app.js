const express=require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose =require("mongoose");
const lodash=require("lodash");

mongoose.connect("mongodb+srv://maarimuthu107:2V9jzjLgcaRxALww@cluster0.lzn4aoh.mongodb.net/todolistDB");

const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const itemsSchema=new mongoose.Schema({
    name:String
});

const Item=mongoose.model("Item",itemsSchema);

const listsSchema=new mongoose.Schema({
    title:String,
    data:[itemsSchema]
});

const List=mongoose.model("List",listsSchema);

var item1=new Item({
    name:"Enter new item and press + "
});

var item2=new Item({
    name:"<-- click here to delete "
});


var defaultItems=[item1,item2];

app.get("/",function(req,res){
    // we can use date.getDate() or date.getDay()

    Item.find().then((items)=>{
        if(items.length===0){
            Item.insertMany(defaultItems).then(()=>{
                console.log("success");
            }).catch((err)=>{
                console.log(err);
            });
            res.redirect("/");
        }else{
            res.render("list",{listTitle:"Today", newListItems :items});
        }
    }).catch((err)=>{
        console.log(err);
    });
  
});

app.post("/",function(req,res){
    let itemData=req.body.newItem;
    let itemTitle=req.body.list;

    let item=new Item({
        name:itemData
    });

    if(itemTitle==="Today"){
        item.save();        
        res.redirect("/");
    }else{
        List.findOne({title:itemTitle}).then((foundList)=>{
            foundList.data.push(item);
            foundList.save();
            res.redirect("/"+itemTitle); 
        }).catch((err)=>{
            console.log(err);
        });     
       
    }

});

app.get("/:newList",(req,res)=>{
    const newList=lodash.capitalize(req.params.newList);
    List.findOne({title:newList}).then((items)=>{
        if(items){
            res.render("list",{listTitle:items.title,newListItems:items.data});   
        }else{
            let list=new List({
                title:newList,
                data:defaultItems
            });
            list.save();
            res.redirect("/"+newList);
        }
    }).catch((err)=>{
        console.log(err);
    });

})

app.post("/delete",(req,res)=>{
    var deleteItem=req.body.listId;
    var listName=req.body.listName[0];
    console.log(deleteItem);
    if(listName==="Today"){
        Item.findOneAndDelete({_id:deleteItem}).then().catch((err)=>{
            console.log(err);
        });
        res.redirect("/");
    }else{
        List.findOneAndUpdate({title:listName},{
            $pull:{
                data:{
                    _id:deleteItem
                }
            }
        }).then((foundedList)=>{
            res.redirect("/"+listName);
        });
    }
})



app.get("/about",function(req,res){
    res.render("about");
})

 

app.listen(3000,function(){
    console.log("Server is running on the port 3000");
})

 