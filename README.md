#### Project Introduction

This project is mainly a restaurant management system.

See the link.
[Link](https://www.youtube.com/watch?v=xwU5ItA-lp8)
Same Business Logic but with some different implementations.

This project is designed for restaurant manager to 

- manage dish category
- manage dish item including dish name, dish description and dish price
- manage bill ordered by customers
- manage all customers and customers' permission to use this system

Although this project is mainly designed for restaurant managers, I also add a role for customers for the purpose of using different roles in my project.

The role for customer only has the right to generate the order and view bills. 


[website](http://restaurant-project-lzw-frontend.s3-website.us-east-2.amazonaws.com/)



#### Technology Used In This Project

- Frontend
  - Angular
  - BootStrap
  - Angular Material UI
  - NgxUiLoader
  - Angular Form Control and Angular Form Validation
  - Angular MatTable
  - Angular MatDialog
  - Angular Routing
  - Angular Charts
  - Angular HttpClient
  - Angular Http Interceptors
- Backend
  - MySQL Database
  - Spring Data Jpa Repository
  - Dynamic Update and Dynamic Insert in Hibernate
  - Many to One (product to category) and Join Column
  - Generated Value Annotation for MySQL DB
  - Java 8 Functionalities
  - Spring Boot
  - Spring Boot Annotations, **RestController, Autowired, Service, RequestMapping, all mapping annotations**
  - Spring Security + Jwt Token For Validation
  - Spring HttpStatus and Response Entity
  - Java Mail
  - Lombok for logging information
- deployment
  - AWS EC2
  - Terminus for SSH linking
  - AWS RDS MySQL
  - AWS S3 Routing  



#### Steps

1. showing the page with responsive style.
   - responsive style
   - this page gives an introduction to our restaurant.
   - there are 3 buttons, **login, register and forget password**.
2. Log in first by admin
   - admin cannot be registered in this system. It can only be added in db level.
   - login shows validation and error, only when this enables we can click on login
3. put into dashboard page first
   - show the change password
     - old password must equals to password in db.
     - new password must equals to the confirmed password.
   - logout page shows logout
   - Forgot password usage
     - shows format needs to be clicked
     - transfer into database level
4. Login to restaurant again
   - shows total category, total product and total order
   - Data Visualization
     - Shows which weekday earns more, we can adjust the stretegy for different opening hours for different weekdays
     - Shows the earning for last 7 days
     - Show which dish item is been sold more, the restaurant can put different strategy for different products
5. Manage category by admin
   - List all the categories for this system.
   - the filter is used to search the category
   - add category shows that we can add new category to this item
     - the name can only start with letter and can only have letters and space
   - update the category
     - Also shows the food item belongs to category also changed.
6. Manage Product
   - List all the products
   - filter same as before
   - edit button shows **bug** - fixed
     - changed price should be valid. 
   - Delete an product by delete button
   - Deactivate button means this cannot be ordered.
   - add button
     - price should be valid.
     - change product name can only start with letter and can only have letters and space
     - Category select option
7. Manage Order
   - First All Customer Information Items are required
   - category and the only products behind category show
   - price and total is read only cannot be changed
   - cannot add the already exisiting button
   - show delete
8. view bill shows the bill items here, click on buttons we can see the details
9. manager user is used to click on button
   - if it is not activated, it cannot login in.
10. Sign Up Page for user
    - Sign up page modification for close button **bug**
    - when registered, cannot login since the administator cannot give the priority to it.
    - when giving the priority it can login in.
11. Login as user
    - when clicking on login, you are not authorized to get into this page.
    - cannot see some buttons over here
    - you can only order for yourself cannot order other.
    - can only view the bill by yourself.



#### Questions and Answers

1. why to use Dynamic Insert and Dynamic Update Annotation in PoJo Level?

   - only generate Dynamic SQL query for inserting values for not null columns defined in db
   - only generate Dynamic SQL query for updating values for "changed" part
   - improves efficiency a lot.

2. jwt implemenation

   - backend
     - configure jwt filter before UserNameAndPasswordFilter 
     - in jwt filter invoke the loadUserByUserName in UserDetailsService + extract the role for this authority
     - validate the token between UserDetails Object
     - If success, put an UserNameAndPasswordAuthentication into SecurityContext for future authentication
   - frontend
     - config interceptor in angular to add some header in each request
   - Notes
     - some apis like login/signup/forgotPassword doesn't have some api requirements
     - if something went wrong just redirect to the homepage and delete the token

3. usage of table foreign key

   ```java
   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "category_fk", nullable = false)
   private Category category;
   ```

4. Java 8 New Features

   - In Rest controller, we define some interface with default methods. Functional Interface
   - In Service, some method, I created a different thread to help me to do some save method in data jpa.
   - I use multi-thread to handle execption in each method.
   - I used optional for data jpa method findById

5. How to achieve parent-child communication?

   - Event Emitter - child emit - parent - subscribe

   - second method

     - ```typescript
        handleViewAction(values: any) {
           const dialogConfig = new MatDialogConfig();
           dialogConfig.data = {
             data: values
           }
           dialogConfig.width = '100%';
           const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
           this.router.events.subscribe(() => {
             dialogRef.close();
           });
         }
       ```

     - ```typescript
       constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
                     public dialogRef: MatDialogRef<ViewBillProductsComponent>) { }
       ```

6. Order logic

   - select for category changed, update the product items and change all other to null, null, null
   - select for product changed, update all other items to price, 1, price
   - Change the number, change the total price



#### Future Improvements

- pagenation for a lot of data
- table can be sorted by some criteria



