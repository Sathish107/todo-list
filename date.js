// when we call a function we generally type the function name with () but here we dont .
// Because if we do so Js will call the function by seeing the line of importing the model in this.apply.js itself

exports.getDate= function (){
    let today=new Date();

    let options={
        weekday:"long",
        day:"numeric",
        month:"long"
    };
   
    return today.toLocaleDateString("en-US",options);
 
};

exports.getDay= function (){
    let today=new Date();

    let options={
        weekday:"long"
    };
   
    return today.toLocaleDateString("en-US",options);

     
};