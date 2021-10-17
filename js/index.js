document.addEventListener('DOMContentLoaded', () => {

   const tabs = document.querySelectorAll('.tabheader__item'),
         tabsContent = document.querySelectorAll('.tabcontent'),
         tabsParent = document.querySelector('.tabheader__items');

   function hideTabContent () {                      
      tabsContent.forEach(item => {                         //скрыть все элементы
         item.style.display = "none";
      });

      tabs.forEach(item => {                                //убрать класс эктив у всех
         item.classList.remove('tabheader__item_active');
      });
   }

   function showTabContent (i=0) {                          //добавить класс эктив нужному элементу
      tabsContent[i].style.display = 'block';
      tabs[i].classList.add('tabheader__item_active');
   }

   hideTabContent();                                        
   showTabContent();

   tabsParent.addEventListener('click', function(event) {             //делегирование от tabsParent к tabs
     const target = event.target;
      if(target && target.classList.contains('tabheader__item')) {
         tabs.forEach((item, i) => {
            if (target == item) {
               hideTabContent();
               showTabContent(i);
            }
         });
      }
   });















});