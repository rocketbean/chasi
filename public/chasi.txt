
# Chasi
**RESTApi** Framework for **node.js**
this framework implements services such as
- Database
- Routing
- Middlewares
- Services
- Model
- View
- Controller
 
it might still be missing some features, please take a note on that, and if you're interested, we can open a discussion about that.

*and find the community for chasi, as i'll be posting any upcommings in that website, 
and plus you can also add some discussions if you have any suggestions*


# Installation
  fork this repo,
  then run npm i
  
## starting the server
    // after setting up your .env file 

```
 // run 
 >>   node server.js
 // or if on development, you can install nodemon then run
 >>   nodemon server.js
 ```
  
# Scripts
chasi command lines: 
> ### Creating Controller
```
> node chasi new controller <*ControllerName*>
```
 
  > this will generate your controller inside **./container/controllers/** path, 
  which can be pointed to a certain route in route containers
  **e.g.**  
  ```
route.get("yourpath", "yourcontroller@method");
route.post("yourpath2", "yourcontroller2@method2");

route.group({ prefix: "yourPathPrefix", middleware: [ "yourMiddlewareAlias" ]}, (() => {
    route.post('endpoint', "yourcontroller3@method3");
}));
  ```
<hr/>

> ### Creating  Model
  
```
> node chasi new model <*ModelName*>
```

  > by default, in your **Controller** the registered models is accessible via **this.models**
   you can try to check it out:
  **e.g.**
 ```
this.models.user //inside your controller methods
console.log(this.models) // or try this instead to see the registered models
 ```
 <hr/>
 
  > ### Creating Service Provider
  
```
> node chasi new provider <*ServiceProvider*>
```
  > please note that ServiceProviders must be declared in **./config/container** under **ServiceBootstrap** property before it can be utilized, by then it will be registered to the chasi third party container, and will be accessible to any registered controller via the get method
  *e.g.*
```
get yourModule () {
    return this.services.yourModule
}
```
<hr/>

> ### Creating Middleware

```  
> node chasi new middleware <*middlewareName*>
```
  > middlewares must also be registered in **./config/container** under **middlewares** property, before it can
    be attached to any route/ route group/ route container.
  **e.g.**
  ```
route.post("yourpath", "yourcontroller@method").middleware("yourmiddleware");
  ```
  *or you can add in the alias in ./config/services/RouterServiceProvider under middlewares array, this will be applied to all the routes under that routeContainer* 
# View
now utilizes Next.js for SSR.
please be sure to run :
```
node chasi install
```
or go to path: "./container/views/" and run
```
npm install
```

# Notes
  as of this moment, MongoDB is the only database it supports, though Databases can be imported directly unto controller,
  so you can have your DB wrapper *(only if you are not using MongoDB as your database)*
  
  Might release a version built with TS. this repo was built in the most simpliest way to support any type of devs.

# Requirements 
this template requires 
- nodejs: ^14.0.0
- mongoDB: ^3.0.0