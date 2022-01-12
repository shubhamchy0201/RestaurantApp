function Items(name,price,type,qty){
          this.name=name;
          this.price=price;
          this.type= type;
          this.qty=qty;
      }
      
      const menuItems = [new Items("Biryani",250,"biryani",1)]
      menuItems.push(new Items("Mutton Biryani",350,"biryani",1));
      menuItems.push(new Items("AppleCrisp",100,"dessert",1));
      menuItems.push(new Items("Vanilla Ice Cream",150,"dessert",1));
      menuItems.push( new Items("Egg Manchria",150,"starters",1));
      menuItems.push( new Items("Chicken Noodles",200,"starters",1));
      menuItems.push(new Items("French Fries",50,"extras",1));
      menuItems.push(new Items("Butter Naans",100,"extras",1));
      menuItems.push(new Items("Chilli Prawns",200,"seafood",1));
      menuItems.push(new Items("Lemon Tea",100,"beverages",1));
      
      var t ="";
      var mId=1;
      for(const item of menuItems){
      
          t=t+ '<div id ="'+mId+'" class="card items-drag" draggable="true" ><div class="card-body"><h3 class="card-title">'+item.name+'</h3><p class="card-text">'+item.price+'</p><br> </div></div>';
          mId+=1;
      }
      
      document.getElementById("items").innerHTML=t;
      
      
      
      function searchItems(){
      
          let input = document.getElementById("searchItem").value;
          input = input.toLowerCase();
          const cardContainer= document.getElementById("items");
          const cards = cardContainer.getElementsByClassName("card");
          for(let i=0;i<cards.length;i++){
      
               let title = cards[i].querySelector(".card-body h3.card-title");
               
               if(title.innerHTML.toLowerCase().indexOf(input) > -1 || menuItems[i].type.toLowerCase().indexOf(input) > -1){
                   cards[i].style.display="";
               }
               else{
                   cards[i].style.display="none";
               }
          }
      }
      
      function searchTables(){
      
          let input = document.getElementById("searchTable").value;
          input = input.toLowerCase();
          console.log(input);
          const cardContainer= document.getElementById("table-names");
          console.log(cardContainer);
          const cards = cardContainer.getElementsByClassName("card");
          for(let i=0;i<cards.length;i++){
               let title = cards[i].querySelector(".card-body h3.card-title");
               if(title.innerHTML.toLowerCase().indexOf(input) > -1){
                   cards[i].style.display="";
               }
               else{
                   cards[i].style.display="none";
               }
          }
      }
      
      
      // Drag and drop
      
      const itemsDraggable = document.querySelectorAll(".items-drag");
      const all_tables = document.querySelectorAll(".drop-table");
      let dragabbleItem = null;
      
      itemsDraggable.forEach((item) => {
          item.addEventListener("dragstart",dragStart);
          item.addEventListener("dragend", dragEnd);
      });
      function dragStart(){
          dragabbleItem = this;
          console.log("drag start");
      }
      function dragEnd(){
          dragabbleItem = null;
          console.log("drag end");
      }
      
      all_tables.forEach((table) => {
      
          table.addEventListener("dragover",dragOver);
          table.addEventListener("dragenter",dragEnter);
          table.addEventListener("dragleave",dragLeave);
          table.addEventListener("drop",dragDrop);
      
      });
      function dragOver(e){
          e.preventDefault();
          this.style.border="1px dashed red"
         
      }
      function dragEnter(){
          this.style.border = "1px dashed red"
          console.log("drag enter");
      }
      function dragLeave(){
          this.style.border = "none";
          console.log("drag Leave");
      }
      
      
      function dragDrop(){
      
          this.style.border = "none";
          const spans = this.getElementsByTagName("span");
          const itemCost = dragabbleItem.getElementsByTagName("p");
         
          spans[1].innerHTML = Number(spans[1].innerHTML)+1;
          spans[0].innerHTML = Number(spans[0].innerHTML)+Number(itemCost[0].innerHTML);
      
          var str = this.getElementsByTagName("h3")[0].innerHTML;
          var matches = str.match(/(\d+)/);
          // console.log(matches);
          // console.log(matches[0]);
          // console.log(sessionStorage[matches[0]]);
          if(sessionStorage[matches[0]]){
      
              let result = JSON.parse(sessionStorage.getItem(matches[0]));
              //console.log(result);
              let flag=1;
              for(let i =0; i<result.length;i++){
                  let first = result[i][0];
                  let quantity = result[i][1];
                  if(first == dragabbleItem.id){
                     result[i][1] = quantity+=1;
                     flag=0;
                     break;
                  }
              }
              if(flag){
                  result.push([dragabbleItem.id,menuItems[dragabbleItem.id].qty]);
              }
              sessionStorage.setItem(matches[0],JSON.stringify(result));
      
              
              
          }else{      
              sessionStorage.setItem(matches[0],JSON.stringify([[dragabbleItem.id,menuItems[dragabbleItem.id].qty]]));   
          }
      }
      
      
      //popup and bill
      
      function openPopUp(id){
      
          var str = id.getElementsByTagName("h3")[0].innerHTML;
          var matches = str.match(/(\d+)/);
         
         openItems(matches[0]);
          
      }
      
      
      function deleteItem(id,index, tableId,qty,price){
      
          let result = JSON.parse(sessionStorage.getItem(tableId));
          result.splice(index,1);
          sessionStorage.setItem(tableId,JSON.stringify(result));
          billId="tableBill-"+tableId;
          const tableName = document.getElementById(billId);
          const spans = tableName.getElementsByTagName("span");
          spans[1].innerHTML = Number(spans[1].innerHTML)-1;
          spans[0].innerHTML = Number(spans[0].innerHTML)-qty*price;
          
          openItems(tableId);
          
      }
      
      function increment(id, itemId,index){
         
          let serves = id.value;
          let result = JSON.parse(sessionStorage.getItem(id.name));
          result[index][1]= serves;
          sessionStorage.setItem(id.name,JSON.stringify(result));
          result = JSON.parse(sessionStorage.getItem(id.name));
         
          var totalbill=0;
          for(let i =0; i< result.length;i++){
              let first = result[i][0];
              let quantity = result[i][1];
              let itemId = Number(first); 
              totalbill+=(menuItems[itemId-1].price * quantity);
          }
      
          document.getElementById("total-bill").innerHTML= totalbill;
          
        
      }
      
      function openItems(tableId){
      
          let result = JSON.parse(sessionStorage.getItem(tableId));
          console.log(result);
          let sNo="<h5>S.No</h5>", itemName="<h5>Item</h5>", itemPrice="<h5>Price</h5>";
          let servings = "<h5>Number of servings</h5>";
          let deleteIcon = "<h5>Delete</h5>";
          var totalbill=0;
          if(result.length == 0){
              document.querySelector(".pop-up").style.display="none";
              return ;
          }
          for(let i =0; i< result.length;i++){
              let first = result[i][0];
              let quantity = result[i][1];
              let itemId = Number(first); 
              let val = i+1; 
              totalbill+=(menuItems[itemId-1].price * quantity);
              sNo+="<p>"+val+"</p>";
              itemName+="<p>"+menuItems[itemId-1].name+"</p>";
              itemPrice+="<p>"+(menuItems[itemId-1].price  )+"</p>";
              servings+="<input  type='number' name='"+tableId+"' value='"+quantity+"' size='1' onchange='increment(this,"+itemId+","+i+")' /> "; 
              deleteIcon+="<p onclick='deleteItem(this, "+i+", "+tableId+","+quantity+","+menuItems[itemId-1].price+")'  ><i class='fas fa-trash' ></i></p>";
             
          }
          let closeSession =  "<p onclick='generateBill("+tableId+")'>Close Session[Generate Bill]</p>"
           
          document.getElementById("sno").innerHTML=sNo;
          document.getElementById("item-name").innerHTML=itemName;
          document.getElementById("item-price").innerHTML=itemPrice;
          document.getElementById("servings").innerHTML=servings;
          document.getElementById("total-bill").innerHTML= totalbill;
          document.getElementById("delete-icon").innerHTML = deleteIcon;
          document.getElementById("close-session").innerHTML = closeSession;
          document.querySelector(".pop-up").style.display="flex";
      }
      
      function closePopUp(id){
         
          document.querySelector(".pop-up").style.display="none";
      }
      
      
      
      
      
      function generateBill(tableId){ 
          let result = JSON.parse(sessionStorage.getItem(tableId));
          let sNo="<h5>S.No</h5>", itemName="<h5>Item</h5>", itemPrice="<h5>Price</h5>";
          let servings = "<h5>Number of servings</h5>";
          var totalbill=0;
          for(let i =0; i< result.length;i++){
              let first = result[i][0];
              let quantity = result[i][1];
              let itemId = Number(first); 
              let val = i+1; 
              totalbill+=(menuItems[itemId-1].price * quantity);
              sNo+="<p>"+val+"</p>";
              itemName+="<p>"+menuItems[itemId-1].name+"</p>";
              itemPrice+="<p>"+(menuItems[itemId-1].price  )+"</p>";
              servings+="<p>"+quantity+"</p>";
             
          }
          billId="tableBill-"+tableId;
          const tableName = document.getElementById(billId);
          const spans = tableName.getElementsByTagName("span");
          spans[1].innerHTML = 0;
          spans[0].innerHTML = 0;
          sessionStorage.removeItem(tableId);
          document.getElementById("sno").innerHTML=sNo;
          document.getElementById("item-name").innerHTML=itemName;
          document.getElementById("item-price").innerHTML=itemPrice;
          document.getElementById("servings").innerHTML=servings;
          document.getElementById("total-bill").innerHTML= totalbill;
          document.getElementById("delete-icon").innerHTML="";
          document.getElementById("close-session").innerHTML = "";
          
      }
      
      